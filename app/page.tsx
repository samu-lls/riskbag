"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function Home() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [showManual, setShowManual] = useState(false);
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomCode.trim()) return;
    
    // Salva o nome e redireciona pra sala
    localStorage.setItem("playerName", name.trim());
    router.push(`/room/${roomCode.toLowerCase()}`);
  };

  return (
    <main className={`min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 relative ${inter.className}`}>
      
      {/* Botão Superior para o Manual */}
      <button 
        onClick={() => setShowManual(true)} 
        className="absolute top-6 right-6 text-xs text-blue-400 border border-blue-500/30 px-4 py-2 rounded-[6px] hover:bg-blue-500/10 uppercase tracking-wider transition-all"
      >
        Manual de Sobrevivência
      </button>

      <div className="max-w-md w-full text-center">
        <p className="text-[11px] tracking-[0.08em] text-[rgba(255,255,255,0.4)] uppercase mb-4">Acesso ao Sistema</p>
        <h1 className={`${playfair.className} text-6xl text-[#d4a853] tracking-tight mb-12`}>Mercado Negro</h1>
        
        <form onSubmit={handleJoin} className="bg-[#111111] border border-[rgba(255,255,255,0.07)] rounded-[10px] p-8 flex flex-col gap-6 text-left">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Seu Alias (Nome)</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded-[6px] px-4 py-3 text-white focus:outline-none focus:border-[#d4a853] transition-colors"
              placeholder="Ex: ZeroCool"
              maxLength={12}
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Código do Servidor (Sala)</label>
            <input 
              type="text" 
              value={roomCode} 
              onChange={(e) => setRoomCode(e.target.value)}
              className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded-[6px] px-4 py-3 text-white focus:outline-none focus:border-[#d4a853] transition-colors uppercase"
              placeholder="Ex: ALPHA"
              maxLength={8}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-white text-[#0a0a0a] font-medium text-[15px] py-4 rounded-[6px] hover:bg-gray-200 active:scale-[0.98] transition-all"
          >
            Conectar à Rede
          </button>
        </form>
      </div>

      {/* MODAL DO MANUAL COMPLETO */}
      {showManual && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-md">
          <div className="bg-[#111111] border border-blue-500/30 w-full max-w-4xl rounded-[10px] p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowManual(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white font-bold text-2xl">&times;</button>
            
            <h2 className={`${playfair.className} text-4xl text-blue-500 mb-2 text-center`}>Manual de Sobrevivência</h2>
            <p className="text-center text-[rgba(255,255,255,0.5)] mb-10 text-sm">Leia atentamente antes de apostar sua vida no Mercado Negro.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[rgba(255,255,255,0.8)] text-sm leading-relaxed">
              
              {/* Coluna 1 */}
              <div>
                <h3 className="text-xl text-white font-semibold mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2">1. O Objetivo</h3>
                <p className="mb-6">Você é um hacker invadindo um servidor. O último jogador vivo na mesa ganha. Todos começam com <strong>3 de HP</strong> (Vida).</p>

                <h3 className="text-xl text-white font-semibold mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2">2. A Rodada</h3>
                <p className="mb-2">No seu turno, você é obrigado a interagir com o <strong>Saco de Risco</strong>. Você tem apenas duas opções:</p>
                <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-300">
                  <li><strong>Sacar:</strong> Tira 1 item aleatório do saco. Você pode fazer isso quantas vezes quiser no mesmo turno.</li>
                  <li><strong>Passar a Vez:</strong> Encerra seu turno com segurança. Todo material "Bom" que você sacou vai para o seu <em>Cofre</em>. Toda "Ameaça" volta para o Saco.</li>
                </ul>

                <h3 className="text-xl text-white font-semibold mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2">3. O Que Tem no Saco?</h3>
                <p className="mb-2"><strong>Materiais Bons (Vão para o cofre):</strong></p>
                <ul className="pl-5 mb-4 space-y-1">
                  <li><span className="text-green-500 font-bold">PCB (Verde):</span> Placa de circuito.</li>
                  <li><span className="text-blue-500 font-bold">Blueprint (Azul):</span> O recurso mais valioso.</li>
                  <li><span className="text-yellow-500 font-bold">Bateria (Amarelo):</span> Energia para os itens.</li>
                </ul>
              </div>

              {/* Coluna 2 */}
              <div>
                <p className="mb-2"><strong>Ameaças (Perigos Imediatos):</strong></p>
                <ul className="pl-5 mb-6 space-y-4">
                  <li>
                    <span className="text-red-500 font-bold">Curto-Circuito (Vermelho):</span> Tirar um não faz nada. Porém, se você sacar o <strong>segundo Curto-Circuito</strong> no mesmo turno:
                    <br/><span className="text-red-400 mt-1 block">💥 EXPLOSÃO: Você perde 1 HP, perde TODOS os itens que sacou neste turno, e passa a vez à força.</span>
                  </li>
                  <li>
                    <span className="text-purple-500 font-bold">Vírus (Roxo):</span> Tirar um não faz nada. Se sacar o <strong>segundo Vírus</strong>:
                    <br/><span className="text-purple-400 mt-1 block">🦠 CONGELAMENTO: Você não perde HP, mas perde a mão inteira e o seu turno é pulado à força.</span>
                  </li>
                </ul>

                <h3 className="text-xl text-white font-semibold mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2">4. A Fase de Compras</h3>
                <p className="mb-6">Quando a mesa dá a volta completa (todos jogaram uma vez), a rodada acaba. A tela de <strong>Mercado Negro</strong> se abrirá para todos simultaneamente. Nela, você gasta os Materiais Bons que guardou no seu Cofre para craftar armas, curas e defesas contra os inimigos.</p>

                <h3 className="text-xl text-white font-semibold mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2">5. Dicas de Ouro</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 italic">
                  <li>A ganância mata. Tirar muitos itens aumenta a chance da explosão. Saiba a hora de passar a vez.</li>
                  <li>Ataques como "Zero-Day" podem matar um inimigo instantaneamente. Compre o "Firewall" para se proteger passivamente.</li>
                </ul>
              </div>

            </div>

            <button onClick={() => setShowManual(false)} className="mt-10 w-full bg-blue-600 text-white font-bold py-4 rounded hover:bg-blue-500 transition-all text-lg tracking-wider uppercase">
              Estou Pronto
            </button>
          </div>
        </div>
      )}

    </main>
  );
}