"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, Inter } from "next/font/google";

// Configuração das fontes importadas diretamente pelo Next.js
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  style: ["normal", "italic"] 
});
const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500"] 
});

export default function Home() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomCode.trim()) return;
    
    localStorage.setItem("playerName", name);
    router.push(`/room/${roomCode.toUpperCase().trim()}`);
  };

  return (
    // Fundo preto puro, aplicando a fonte Inter globalmente para os textos
    <main className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 ${inter.className}`}>
      
      {/* Card Central: dimensões, cores e bordas exatas da especificação */}
      <div className="w-full max-w-[480px] bg-[#111111] border border-[rgba(255,255,255,0.07)] rounded-[10px] p-10 sm:p-12">
        
        <div className="text-center mb-10">
          {/* Título: Fonte serifada, elegante, com acento na cor âmbar/dourado e em itálico */}
          <h1 className={`${playfair.className} text-4xl sm:text-5xl text-white mb-3 tracking-tight`}>
            Saco de <em className="text-[#d4a853] italic">Risco</em>
          </h1>
          {/* Subtítulo: Sem caixa alta, cor sutil */}
          <p className="text-[rgba(255,255,255,0.5)] text-sm">
            Prepare-se para sacar.
          </p>
        </div>

        <form onSubmit={handleJoin} className="flex flex-col gap-6">
          
          {/* Input: Nome */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] tracking-[0.08em] text-[rgba(255,255,255,0.4)] uppercase">
              Identificação
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[48px] bg-[#0f0f0f] border border-[rgba(255,255,255,0.12)] rounded-[6px] pl-4 pr-4 text-[15px] text-white placeholder:text-[rgba(255,255,255,0.2)] focus:outline-none focus:border-[rgba(255,255,255,0.35)] transition-colors"
              placeholder="Seu nome ou apelido"
              maxLength={15}
              required
            />
          </div>

          {/* Input: Sala */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] tracking-[0.08em] text-[rgba(255,255,255,0.4)] uppercase">
              Código alvo
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full h-[48px] bg-[#0f0f0f] border border-[rgba(255,255,255,0.12)] rounded-[6px] pl-4 pr-4 text-[15px] text-white placeholder:text-[rgba(255,255,255,0.2)] focus:outline-none focus:border-[rgba(255,255,255,0.35)] transition-colors uppercase"
              placeholder="EX: SALA42"
              maxLength={10}
              required
            />
          </div>

          {/* Botão de Ação */}
          <button
            type="submit"
            disabled={!name.trim() || !roomCode.trim()}
            className="mt-2 w-full h-[52px] bg-white text-[#0a0a0a] font-medium text-[15px] rounded-[6px] hover:bg-gray-200 active:scale-[0.99] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            Acessar sala
          </button>

        </form>
      </div>
    </main>
  );
}