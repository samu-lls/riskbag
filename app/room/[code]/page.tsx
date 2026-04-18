// @ts-nocheck
/* eslint-disable */
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = String(params?.code || "");

  const hasInitialized = useRef(false);

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const playerName = localStorage.getItem("playerName");
    if (!playerName) {
      router.push("/");
      return;
    }

    const initGame = async () => {
      try {
        // 1. Busca ou Cria a Sala
        let { data: roomData } = await supabase.from("rooms").select("*").eq("code", roomCode).single();

        if (!roomData) {
          const { data: newRoom } = await supabase.from("rooms").insert({ code: roomCode }).select().single();
          roomData = newRoom;
        }
        
        // 2. CORREÇÃO DO BUG F5: Checa se o jogador já existe na sala antes de criar
        let { data: existingPlayer } = await supabase
          .from("players")
          .select("*")
          .eq("room_id", roomData.id)
          .eq("name", playerName)
          .single();

        let playerData = existingPlayer;

        // Se não existir, cria um novo
        if (!playerData) {
          const { data: newPlayer } = await supabase.from("players").insert({
            room_id: roomData.id,
            name: playerName,
          }).select().single();
          playerData = newPlayer;
        }
        
        // Se a sala não tem turno, passa pro jogador atual
        if (!roomData.current_turn_player_id) {
          await supabase.from("rooms").update({ current_turn_player_id: playerData.id }).eq("id", roomData.id);
          roomData.current_turn_player_id = playerData.id;
        }

        setRoom(roomData);
        setMe(playerData);

        const fetchPlayers = async () => {
          const { data } = await supabase.from("players").select("*").eq("room_id", roomData.id).order("joined_at", { ascending: true });
          if (data) setPlayers(data);
        };
        await fetchPlayers();
        setLoading(false);

        const channel = supabase.channel(`room_${roomData.id}`)
          .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomData.id}` }, 
            (payload) => {
              if (payload.new.id === playerData.id) setMe(payload.new);
              fetchPlayers();
            }
          )
          .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomData.id}` }, 
            (payload) => setRoom(payload.new)
          )
          .subscribe();

        return () => { supabase.removeChannel(channel); };
      } catch (error) {
        console.error("Erro ao inicializar o jogo:", error);
      }
    };

    initGame();
  }, [roomCode, router]);

  // ==========================================
  // LÓGICA DE TURNOS E ALVOS
  // ==========================================
  const isMyTurn = room?.current_turn_player_id === me?.id;
  const amIDead = me?.hp <= 0;
  
  const getNextAlivePlayer = () => {
    const myIndex = players.findIndex(p => p.id === me.id);
    for (let i = 1; i < players.length; i++) {
      const nextP = players[(myIndex + i) % players.length];
      if (nextP.hp > 0) return nextP;
    }
    return null;
  };

  const alivePlayers = players.filter(p => p.hp > 0);
  const isGameOver = alivePlayers.length === 1 && players.length > 1;

  // Encontra os dados do jogador que está jogando agora (Para o modo Espectador)
  const activePlayer = players.find(p => p.id === room?.current_turn_player_id);

  // ==========================================
  // AÇÕES DO JOGO
  // ==========================================
  const handleDraw = async () => {
    if (!isMyTurn || amIDead || isGameOver) return;

    const totalInBag = room.bag_greens + room.bag_blues + room.bag_reds;
    if (totalInBag <= 0) return alert("O Saco de Risco está vazio!");

    const roll = Math.random() * totalInBag;
    let newBagGreens = room.bag_greens;
    let newBagBlues = room.bag_blues;
    let newBagReds = room.bag_reds;

    let newTurnGreens = me.turn_greens;
    let newTurnBlues = me.turn_blues;
    let newRedsInTurn = me.reds_in_turn;
    let newHp = me.hp;
    let newForcedDraws = Math.max(0, me.forced_draws - 1);

    let isExplosion = false;

    if (roll < newBagGreens) {
      newBagGreens--;
      newTurnGreens++;
    } else if (roll < newBagGreens + newBagBlues) {
      newBagBlues--;
      newTurnBlues++;
    } else {
      newBagReds--;
      newRedsInTurn++;
      if (newRedsInTurn >= 2) {
        isExplosion = true;
        newHp--;
        newTurnGreens = 0; 
        newTurnBlues = 0;
        newRedsInTurn = 0;
        newForcedDraws = 0; 
      }
    }

    await supabase.from("rooms").update({ bag_greens: newBagGreens, bag_blues: newBagBlues, bag_reds: newBagReds }).eq("id", room.id);
    await supabase.from("players").update({ hp: newHp, turn_greens: newTurnGreens, turn_blues: newTurnBlues, reds_in_turn: newRedsInTurn, forced_draws: newForcedDraws }).eq("id", me.id);

    if (isExplosion) {
      alert("💥 CURTO-CIRCUITO! Você sacou o 2º Curto. 1 Dano recebido e turno perdido.");
      if (newHp <= 0) {
         const nextP = getNextAlivePlayer();
         if (nextP) await supabase.from("rooms").update({ current_turn_player_id: nextP.id }).eq("id", room.id);
      } else {
         await handlePassTurn(true);
      }
    }
  };

  const handlePassTurn = async (isFromExplosion = false) => {
    if (!isMyTurn || amIDead || isGameOver) return;
    if (!isFromExplosion && me.forced_draws > 0) return alert(`Você precisa sacar mais ${me.forced_draws} vez(es)!`);

    const nextPlayer = getNextAlivePlayer();
    if (!nextPlayer) return;

    if (!isFromExplosion) {
      await supabase.from("players").update({
        greens: me.greens + me.turn_greens,
        blues: me.blues + me.turn_blues,
        turn_greens: 0,
        turn_blues: 0,
        reds_in_turn: 0
      }).eq("id", me.id);
    }

    await supabase.from("rooms").update({ current_turn_player_id: nextPlayer.id }).eq("id", room.id);
  };

  const handleAttack = async (targetId: string) => {
    if (!isMyTurn || me.greens < 3 || amIDead) return;
    
    const target = players.find(p => p.id === targetId);
    if (!target || target.hp <= 0) return;

    await supabase.from("players").update({ greens: me.greens - 3 }).eq("id", me.id);
    await supabase.from("players").update({ hp: target.hp - 1 }).eq("id", target.id);
  };

  const handleUseBlue = async () => {
    if (!isMyTurn || me.blues < 1 || amIDead) return;

    const nextPlayer = getNextAlivePlayer();
    if (!nextPlayer) return;

    await supabase.from("players").update({ blues: me.blues - 1 }).eq("id", me.id);
    await supabase.from("players").update({ forced_draws: nextPlayer.forced_draws + 2 }).eq("id", nextPlayer.id);
  };

  if (loading) return <div className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[rgba(255,255,255,0.5)] ${inter.className}`}>Conectando...</div>;

  return (
    <main className={`min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 ${inter.className}`}>
      
      {isGameOver && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <h1 className={`${playfair.className} text-6xl text-[#d4a853] mb-4`}>Sessão Encerrada</h1>
            <p className="text-white text-lg">Sobrevivente: {alivePlayers[0]?.name}</p>
          </div>
        </div>
      )}

      <header className="max-w-5xl mx-auto flex items-end justify-between border-b border-[rgba(255,255,255,0.07)] pb-6 mb-10">
        <div>
          <p className="text-[11px] tracking-[0.08em] text-[rgba(255,255,255,0.4)] uppercase mb-1">Sessão Ativa</p>
          <h1 className={`${playfair.className} text-3xl text-white tracking-tight`}>
            Sala <em className="text-[#d4a853] italic not-italic-numbers">{room?.code}</em>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[11px] tracking-[0.08em] text-[rgba(255,255,255,0.4)] uppercase mb-1">Saco de Risco</p>
          <div className="flex gap-4 text-sm font-medium">
            <span className="text-green-500">{room?.bag_greens} PCBs</span>
            <span className="text-blue-500">{room?.bag_blues} Blueprints</span>
            <span className="text-red-500">{room?.bag_reds} Curtos</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: Ações do Turno & Espectador */}
        <div className={`md:col-span-2 bg-[#111111] border rounded-[10px] p-8 flex flex-col items-center justify-center min-h-[400px] transition-colors ${isMyTurn && !amIDead ? 'border-[rgba(212,168,83,0.3)]' : 'border-[rgba(255,255,255,0.07)] opacity-80'}`}>
          {amIDead ? (
            <h2 className={`${playfair.className} text-3xl mb-2 text-red-500`}>Eliminado</h2>
          ) : (
            <>
              <h2 className={`${playfair.className} text-2xl mb-4`}>
                {isMyTurn ? "Sua Vez" : `Turno de ${activePlayer?.name || "..."}`}
              </h2>
              
              {/* MODO ESPECTADOR: Todos veem a mão do jogador ativo */}
              {activePlayer && (
                <div className="flex gap-6 mb-8 bg-[#0a0a0a] p-4 rounded-[6px] border border-[rgba(255,255,255,0.05)] text-sm">
                  <span className="text-[rgba(255,255,255,0.6)] uppercase text-[10px] absolute -mt-7">Em mãos agora</span>
                  <div className="text-green-500">{activePlayer.turn_greens} <span className="text-[rgba(255,255,255,0.5)]">PCBs</span></div>
                  <div className="text-blue-500">{activePlayer.turn_blues} <span className="text-[rgba(255,255,255,0.5)]">Blueprints</span></div>
                  <div className={`${activePlayer.reds_in_turn > 0 ? 'text-red-500 animate-pulse' : 'text-red-900'}`}>{activePlayer.reds_in_turn}/2 <span className="text-[rgba(255,255,255,0.5)]">Curtos</span></div>
                </div>
              )}

              {me?.forced_draws > 0 && isMyTurn && (
                <p className="text-[13px] text-[#d4a853] mb-6 animate-pulse">
                  Aviso: Você foi forçado a sacar mais {me.forced_draws} vez(es)!
                </p>
              )}
              
              <div className="flex gap-4 w-full max-w-md mt-2">
                <button 
                  onClick={handleDraw} disabled={!isMyTurn}
                  className="flex-1 h-[52px] bg-white text-[#0a0a0a] font-medium text-[15px] rounded-[6px] hover:bg-gray-200 active:scale-[0.99] disabled:opacity-10 disabled:cursor-not-allowed transition-all"
                >
                  Sacar
                </button>
                <button 
                  onClick={() => handlePassTurn(false)} disabled={!isMyTurn || me?.forced_draws > 0}
                  className="flex-1 h-[52px] bg-[#0f0f0f] border border-[rgba(255,255,255,0.12)] text-white font-medium text-[15px] rounded-[6px] hover:border-[rgba(255,255,255,0.35)] active:scale-[0.99] disabled:opacity-10 disabled:cursor-not-allowed transition-all"
                >
                  Passar & Guardar
                </button>
              </div>

              {/* Botão de Ação Azul */}
              {isMyTurn && me?.blues >= 1 && (
                <button 
                  onClick={handleUseBlue}
                  className="mt-6 w-full max-w-md h-[40px] bg-[rgba(59,130,246,0.1)] border border-blue-500/30 text-blue-400 text-[12px] uppercase tracking-widest rounded-[6px] hover:bg-[rgba(59,130,246,0.2)] transition-all"
                >
                  Usar Blueprint (-1A): Forçar +2 Saques no Próximo
                </button>
              )}
            </>
          )}
        </div>

        {/* COLUNA DIREITA: Jogadores */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[11px] tracking-[0.08em] text-[rgba(255,255,255,0.4)] uppercase mb-2">Rede de Jogadores</h3>
          
          {players.map((p) => {
            const pIsActive = room?.current_turn_player_id === p.id;
            const pIsDead = p.hp <= 0;
            const canAttack = isMyTurn && me?.greens >= 3 && p.id !== me?.id && !pIsDead;
            
            return (
              <div key={p.id} className={`bg-[#111111] border ${pIsActive && !pIsDead ? 'border-[#d4a853]' : 'border-[rgba(255,255,255,0.07)]'} rounded-[10px] p-5 relative overflow-hidden ${pIsDead ? 'opacity-30 grayscale' : ''}`}>
                
                {pIsActive && !pIsDead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4a853]" />}

                <div className="flex justify-between items-center mb-4 pl-2">
                  <span className="font-medium text-[15px]">
                    {p.name} {p.id === me?.id && <span className="text-[#d4a853] text-xs ml-2">(Você)</span>}
                    {pIsDead && <span className="text-red-500 text-xs ml-2">[DESCONECTADO]</span>}
                  </span>
                  
                  <div className="flex gap-2">
                    {canAttack && (
                      <button onClick={() => handleAttack(p.id)} className="text-[10px] bg-green-900/30 text-green-500 border border-green-500/30 px-2 py-1 rounded hover:bg-green-900/60 uppercase transition-all">
                        Hackear (-3 PCBs)
                      </button>
                    )}
                    <span className="text-sm bg-[#0a0a0a] px-2 py-1 rounded-[4px] border border-[rgba(255,255,255,0.05)] text-white">
                      HP: {p.hp}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-center text-xs pl-2">
                  <div className="bg-[#0a0a0a] p-2 rounded-[4px] border border-[rgba(255,255,255,0.02)]">
                    <span className="block text-green-500 mb-1">Cofre (PCBs)</span>
                    <span className="text-[rgba(255,255,255,0.8)] font-medium">{p.greens}</span>
                  </div>
                  <div className="bg-[#0a0a0a] p-2 rounded-[4px] border border-[rgba(255,255,255,0.02)]">
                    <span className="block text-blue-500 mb-1">Cofre (Blueprints)</span>
                    <span className="text-[rgba(255,255,255,0.8)] font-medium">{p.blues}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  );
}