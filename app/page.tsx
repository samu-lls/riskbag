"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { PATCH_NOTES, type PatchEntry } from "@/lib/patchnotes";
import { supabase } from "@/lib/supabase"; // Importação adicionada para a Task 2.2

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"] });

// ─── Typing effect hook ───────────────────────────────────────────────────────
function useTyping(lines: string[], speed = 38) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let lineIdx = 0, charIdx = 0;
    setDisplayed([""]);
    const tick = setInterval(() => {
      const cur = lines[lineIdx];
      charIdx++;
      setDisplayed(prev => {
        const next = [...prev];
        next[lineIdx] = cur.slice(0, charIdx);
        return next;
      });
      if (charIdx >= cur.length) {
        lineIdx++;
        charIdx = 0;
        if (lineIdx >= lines.length) { clearInterval(tick); setDone(true); return; }
        setDisplayed(prev => [...prev, ""]);
      }
    }, speed);
    return () => clearInterval(tick);
  }, []);
  return { displayed, done };
}

const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  novo:          { bg: 'rgba(0,255,136,0.08)',  text: '#00ff88', label: 'NOVO'   },
  melhoria:      { bg: 'rgba(0,170,255,0.08)',  text: '#00aaff', label: 'MELHORIA' },
  fix:           { bg: 'rgba(255,68,68,0.08)',  text: '#ff4444', label: 'FIX'    },
  balanceamento: { bg: 'rgba(212,168,83,0.08)', text: '#d4a853', label: 'BALANÇO' },
};

export default function Home() {
  const [name,          setName]          = useState("");
  const [roomCode,      setRoomCode]      = useState("");
  const [showManual,    setShowManual]    = useState(false);
  const [showPatch,     setShowPatch]     = useState(false);
  
  // Novos estados para a Task 2.2
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [errorMsg,      setErrorMsg]      = useState("");
  
  const router = useRouter();

  const termLines = [
    "> Inicializando sistema...",
    "> Conexão criptografada estabelecida.",
    "> Bem-vindo ao MERCADO NEGRO.",
    "> Insira suas credenciais para acessar.",
  ];
  const { displayed } = useTyping(termLines, 32);

  // Fluxo A - Criar Sala (Task 2.2)
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

const handleCreateRoom = async () => {
    if (!name.trim()) return setErrorMsg("Alias (Nome) é obrigatório.");
    setLoading(true);
    setErrorMsg("");

    try {
      let code = "";
      let exists = true;
      
      while (exists) {
        code = generateRoomCode();
        const { data } = await supabase.from('rooms').select('id').eq('code', code).maybeSingle();
        exists = !!data;
      }

      // Inserção com as quantidades numéricas exatas
      const { error: insertError } = await supabase
        .from('rooms')
        .insert([
          { 
            code: code.toUpperCase(), 
            status: 'lobby',
            round_count: 0,
            game_log: ["Sessão iniciada"],
            turn_order: [],
            bag_greens: 0,     // Ajustado de array para número inteiro
            bag_blues: 0,      // Ajustado de array para número inteiro
            bag_batteries: 0,  // Ajustado de array para número inteiro
            bag_reds: 0,       // Ajustado de array para número inteiro
            bag_viruses: 0     // Ajustado de array para número inteiro
          }
        ]);

      if (insertError) throw insertError;

      localStorage.setItem('playerName', name.trim());
      router.push(`/room/${code.toLowerCase()}`);
    } catch (err: any) {
      console.error("Erro na criação da sala:", err);
      setErrorMsg(err.message || "Erro de conexão com o banco.");
      setLoading(false);
    }
  };

  // Fluxo B - Entrar em Sala Existente (Task 2.2)
  const handleJoinRoom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return setErrorMsg("Alias (Nome) é obrigatório.");
    if (!roomCode.trim()) return setErrorMsg("Código da sala é obrigatório.");
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error: fetchError } = await supabase
        .from('rooms')
        .select('status')
        .eq('code', roomCode.toUpperCase())
        .maybeSingle();

      if (fetchError || !data) throw new Error("Sala não encontrada.");
      if (data.status !== 'lobby') throw new Error("Acesso negado: Partida em andamento.");

      localStorage.setItem('playerName', name.trim());
      router.push(`/room/${roomCode.toLowerCase()}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao entrar na sala.");
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-ui)' }}
    >
      {/* ── Background grid lines ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,168,83,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,168,83,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 0,
        }}
      />

      {/* ── Corner decorations ── */}
      <div className="fixed top-4 left-4 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ width: 40, height: 40, borderTop: '1px solid rgba(212,168,83,0.25)', borderLeft: '1px solid rgba(212,168,83,0.25)' }} />
      </div>
      <div className="fixed top-4 right-4 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ width: 40, height: 40, borderTop: '1px solid rgba(212,168,83,0.25)', borderRight: '1px solid rgba(212,168,83,0.25)' }} />
      </div>
      <div className="fixed bottom-4 left-4 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ width: 40, height: 40, borderBottom: '1px solid rgba(212,168,83,0.25)', borderLeft: '1px solid rgba(212,168,83,0.25)' }} />
      </div>
      <div className="fixed bottom-4 right-4 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ width: 40, height: 40, borderBottom: '1px solid rgba(212,168,83,0.25)', borderRight: '1px solid rgba(212,168,83,0.25)' }} />
      </div>

      {/* ── Top buttons ── */}
      <div className="fixed top-6 right-6 flex gap-2" style={{ zIndex: 9997 }}>
        <button
          onClick={() => setShowPatch(true)}
          className="section-label px-3 py-2 rounded border transition-all hover:bg-[rgba(212,168,83,0.06)]"
          style={{ borderColor: 'rgba(212,168,83,0.25)', color: 'rgba(212,168,83,0.7)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
        >
          PATCH NOTES
        </button>
        <button
          onClick={() => setShowManual(true)}
          className="section-label px-3 py-2 rounded border transition-all hover:bg-[rgba(96,165,250,0.06)]"
          style={{ borderColor: 'rgba(59,130,246,0.3)', color: '#60a5fa', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
        >
          MANUAL
        </button>
      </div>

      {/* ── Version badge ── */}
      <div className="fixed bottom-6 left-6" style={{ zIndex: 9997 }}>
        <span className="section-label" style={{ color: 'rgba(212,168,83,0.3)' }}>
          {PATCH_NOTES[0]?.version} — MERCADO NEGRO
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* Left: branding + terminal */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex-1 text-left"
        >
          <p
            className="section-label mb-3"
            style={{ letterSpacing: '0.35em', color: 'rgba(212,168,83,0.5)' }}
          >
            — ACESSO AO SISTEMA —
          </p>

          <h1
            className={`${playfair.className} leading-none mb-2`}
            style={{
              fontSize: 'clamp(52px, 8vw, 88px)',
              color: '#d4a853',
              textShadow: '0 0 40px rgba(212,168,83,0.3), 0 0 80px rgba(212,168,83,0.1)',
            }}
          >
            Mercado
          </h1>
          <h1
            className={`${playfair.className} italic leading-none mb-8`}
            style={{
              fontSize: 'clamp(52px, 8vw, 88px)',
              color: '#e8edf2',
              textShadow: '0 0 20px rgba(232,237,242,0.1)',
            }}
          >
            Negro
          </h1>

          {/* Terminal typing block */}
          <div
            className="rounded-lg p-4"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.05)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              minHeight: 100,
            }}
          >
            {displayed.map((line, i) => (
              <div
                key={i}
                style={{
                  color: i === displayed.length - 1 ? '#d4a853' : 'rgba(200,208,218,0.5)',
                  marginBottom: 4,
                }}
              >
                {line}
                {i === displayed.length - 1 && (
                  <span style={{ animation: 'terminalBlink 1s step-end infinite', marginLeft: 2 }}>█</span>
                )}
              </div>
            ))}
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Multiplayer Online', 'Tempo Real', 'Blefe & Estratégia', 'até 8 jogadores'].map(tag => (
              <span
                key={tag}
                className="section-label px-2.5 py-1.5 rounded"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.12em' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right: login card refatorado para Task 2.2 */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="w-full md:w-[360px]"
        >
          <div
            className="cyber-card corner-tl corner-br p-8"
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 20px rgba(212,168,83,0.05)' }}
          >
            <p className="section-label mb-6" style={{ letterSpacing: '0.25em', textAlign: 'center' }}>
              CREDENCIAIS DE ACESSO
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="section-label" style={{ letterSpacing: '0.2em' }}>
                  Alias (Nome)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: ZeroCool"
                  maxLength={12}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-[6px] text-white placeholder-opacity-30 focus:outline-none transition-all disabled:opacity-50"
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#e8edf2',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(212,168,83,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>

              {errorMsg && (
                <div className="text-[#ff4444] text-xs section-label p-2 rounded" style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}>
                  [ERRO] {errorMsg}
                </div>
              )}

              {!showJoinInput ? (
                <div className="flex flex-col gap-3 mt-2">
                  <button onClick={handleCreateRoom} disabled={loading} className="btn-primary w-full" style={{ height: 52 }}>
                    {loading ? "INICIALIZANDO..." : "CRIAR NOVA SALA"}
                  </button>
                  <button 
                    onClick={() => setShowJoinInput(true)} 
                    disabled={loading}
                    className="w-full section-label px-4 transition-all hover:bg-[rgba(255,255,255,0.03)]" 
                    style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,208,218,0.7)', height: 52, borderRadius: 6 }}
                  >
                    ENTRAR COM CÓDIGO
                  </button>
                </div>
              ) : (
                <form onSubmit={handleJoinRoom} className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="section-label" style={{ letterSpacing: '0.2em' }}>
                        Código da Sala
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowJoinInput(false)} 
                        className="text-[10px] text-gray-500 hover:text-white transition-colors tracking-widest"
                      >
                        VOLTAR
                      </button>
                    </div>
                    <input
                      type="text"
                      value={roomCode}
                      onChange={e => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="Ex: ALPHA1"
                      maxLength={6}
                      disabled={loading}
                      required
                      className="w-full px-4 py-3 rounded-[6px] focus:outline-none transition-all disabled:opacity-50 uppercase"
                      style={{
                        background: 'var(--bg)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 15,
                        letterSpacing: '0.2em',
                        color: '#d4a853',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(212,168,83,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full mt-2" style={{ height: 52 }}>
                    {loading ? "CONECTANDO..." : "ACESSAR SALA"}
                  </button>
                </form>
              )}
            </div>

            <p
              className="text-center mt-4 section-label"
              style={{ letterSpacing: '0.12em', lineHeight: 1.6 }}
            >
              Sem conta necessária. Crie uma nova sessão segura ou junte-se a uma existente.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MODAL: PATCH NOTES
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', overflowY: 'auto' }}
            onClick={e => { if (e.target === e.currentTarget) setShowPatch(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="cyber-card w-full max-w-2xl my-8"
              style={{ borderColor: 'rgba(212,168,83,0.2)', overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Terminal header */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setShowPatch(false)}
                      className="w-3 h-3 rounded-full transition-opacity hover:opacity-70"
                      style={{ background: '#ff3b30' }}
                    />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#ffcc00' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#00ca4e' }} />
                  </div>
                  <span className="section-label" style={{ letterSpacing: '0.25em' }}>
                    PATCH NOTES — MERCADO NEGRO
                  </span>
                </div>
                <span className="section-label mono">{PATCH_NOTES.length} versões</span>
              </div>

              {/* Patch list */}
              <div className="px-5 py-4 flex flex-col gap-6 max-h-[70vh] overflow-y-auto"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {PATCH_NOTES.map((patch, pi) => (
                  <div key={pi}>
                    {/* Version header */}
                    <div className="flex items-baseline gap-3 mb-3">
                      <span
                        className="font-bold text-lg"
                        style={{ color: '#d4a853', textShadow: '0 0 10px rgba(212,168,83,0.4)' }}
                      >
                        {patch.version}
                      </span>
                      <span className="font-bold" style={{ color: '#e8edf2', fontFamily: 'var(--font-ui)', fontSize: 15 }}>
                        {patch.title}
                      </span>
                      <span className="section-label ml-auto" style={{ whiteSpace: 'nowrap' }}>
                        {patch.date}
                      </span>
                    </div>

                    {/* Changes */}
                    <div className="flex flex-col gap-1.5 pl-1">
                      {patch.changes.map((c, ci) => {
                        const cfg = TYPE_COLORS[c.type] || TYPE_COLORS.novo;
                        return (
                          <div
                            key={ci}
                            className="flex items-start gap-2.5 px-3 py-2 rounded"
                            style={{ background: cfg.bg, border: `1px solid ${cfg.text}18` }}
                          >
                            <span
                              className="section-label flex-shrink-0 mt-0.5"
                              style={{ color: cfg.text, letterSpacing: '0.15em', minWidth: 62 }}
                            >
                              {cfg.label}
                            </span>
                            <span style={{ color: 'rgba(200,208,218,0.75)', fontSize: 12, lineHeight: 1.5 }}>
                              {c.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Divider between versions */}
                    {pi < PATCH_NOTES.length - 1 && (
                      <div
                        className="mt-5"
                        style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          MODAL: MANUAL
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showManual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)', overflowY: 'auto' }}
            onClick={e => { if (e.target === e.currentTarget) setShowManual(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="cyber-card w-full max-w-4xl my-8 p-8"
              style={{ borderColor: 'rgba(59,130,246,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowManual(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-white text-2xl font-bold leading-none"
              >
                &times;
              </button>

              <h2
                className={`${playfair.className} text-4xl text-center mb-2`}
                style={{ color: '#60a5fa' }}
              >
                Manual de Sobrevivência
              </h2>
              <p className="section-label text-center mb-10" style={{ letterSpacing: '0.2em' }}>
                — leia antes de apostar sua vida no mercado negro —
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed" style={{ color: 'rgba(200,208,218,0.8)' }}>
                <div>
                  <h3 className="text-white font-bold text-base mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>1. O Objetivo</h3>
                  <p className="mb-5">Você é um hacker invadindo um servidor. O último jogador vivo vence. Todos começam com <strong className="text-white">3 HP</strong>.</p>

                  <h3 className="text-white font-bold text-base mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>2. A Rodada</h3>
                  <p className="mb-2">No seu turno, interaja com o <strong className="text-white">Saco de Risco</strong>:</p>
                  <ul className="space-y-2 mb-5" style={{ color: 'rgba(200,208,218,0.7)' }}>
                    <li><strong className="text-white">Sacar:</strong> Tira 1 item aleatório. Pode repetir quantas vezes quiser.</li>
                    <li><strong className="text-white">Passar a Vez:</strong> Encerra com segurança. Materiais vão ao Cofre, Ameaças voltam ao Saco.</li>
                  </ul>

                  <h3 className="text-white font-bold text-base mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>3. Materiais Bons</h3>
                  <ul className="space-y-1 mb-5">
                    <li><span style={{ color: '#00ff88' }} className="font-bold">PCB (Verde):</span> Placa de circuito.</li>
                    <li><span style={{ color: '#00aaff' }} className="font-bold">Blueprint (Azul):</span> Recurso mais valioso.</li>
                    <li><span style={{ color: '#eab308' }} className="font-bold">Bateria (Amarelo):</span> Energia para itens.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-bold text-base mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>4. Ameaças</h3>
                  <ul className="space-y-4 mb-5">
                    <li>
                      <span style={{ color: '#ff4444' }} className="font-bold">Curto-Circuito (Vermelho):</span>
                      <span style={{ color: 'rgba(200,208,218,0.7)' }}> 1× não faz nada. O </span>
                      <strong className="text-white">2° no mesmo turno:</strong>
                      <span style={{ color: '#ff4444' }}> 💥 Perde 1 HP e todos os itens sacados.</span>
                    </li>
                    <li>
                      <span style={{ color: '#cc44ff' }} className="font-bold">Vírus (Roxo):</span>
                      <span style={{ color: 'rgba(200,208,218,0.7)' }}> 1× não faz nada. O </span>
                      <strong className="text-white">2° no mesmo turno:</strong>
                      <span style={{ color: '#cc44ff' }}> 🦠 Perde a mão e o turno (sem dano).</span>
                    </li>
                  </ul>

                  <h3 className="text-white font-bold text-base mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>5. Mercado Negro</h3>
                  <p className="mb-5" style={{ color: 'rgba(200,208,218,0.7)' }}>
                    Ao fim de cada rodada, a loja abre por <strong className="text-white">60 segundos</strong>. Gaste seus materiais para craftar itens ofensivos, defensivos e de utilidade.
                  </p>

                  <h3 className="text-white font-bold text-base mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>6. Dicas</h3>
                  <ul className="space-y-1 italic" style={{ color: 'rgba(200,208,218,0.6)' }}>
                    <li>A ganância mata — saiba a hora de parar.</li>
                    <li>Zero-Day elimina direto. Firewall bloqueia passivamente.</li>
                    <li>O primeiro da rodada é sorteado — não há vantagem de host.</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowManual(false)}
                className="mt-8 w-full h-12 rounded font-bold tracking-widest uppercase text-sm transition-all"
                style={{ background: 'rgba(59,130,246,0.8)', color: 'white', fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: '0.2em' }}
              >
                Estou Pronto
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}