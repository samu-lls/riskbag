// ─────────────────────────────────────────────────────────────────────────────
// PATCH NOTES — edite este arquivo para atualizar o histórico de versões
// Formato: adicione um novo objeto no INÍCIO do array (versão mais nova primeiro)
// ─────────────────────────────────────────────────────────────────────────────

export type PatchEntry = {
  version: string;   // ex: "v1.2"
  date: string;      // ex: "Abr 2026"
  title: string;     // título curto da versão
  changes: {
    type: 'novo' | 'melhoria' | 'fix' | 'balanceamento';
    text: string;
  }[];
};

export const PATCH_NOTES: PatchEntry[] = [
    {
    version: "v0.5",
    date: "21, Abr 2026",
    title: "Balanceamente e Nova Mecanica",
    changes: [
      { type: 'novo',          text: "Adicionado a Troca Negra: troque 3 itens por 1 outro a sua escolha!" },
      { type: 'balanceamento', text: "TROJAN: Antes: +3 compras forçadas para qualquer player / Agora: +6 compras forçadas para qualquer player" },
      { type: 'balanceamento', text: "DDoS: Antes: +2 compras forçadas para todos os players / Agora: +4 compras forçadas para para todos os players" },
      { type: 'balanceamento', text: "HP Máximo: Antes: HP máximo ilimitado / Agora: HP Máximo = 4" },
    ],
  },
  {
    version: "v0.4",
    date: "Abr 2026",
    title: "Cyberpunk Visual Overhaul",
    changes: [
      { type: 'novo',          text: "Design completo no estilo Terminal Hacker / Cassino Clandestino." },
      { type: 'novo',          text: "Cartas animadas ao sacar itens do saco com ícone e cor por tipo." },
      { type: 'novo',          text: "Screen shake ao tomar dano, efeito glitch em ataques em área." },
      { type: 'novo',          text: "Timer de 60 segundos no Mercado Negro para agilizar a partida." },
      { type: 'novo',          text: "Pódium e log completo da partida na tela de Game Over." },
      { type: 'melhoria',      text: "Terminal de eventos com scroll interno (não afeta mais a página)." },
      { type: 'balanceamento', text: "Primeiro jogador de cada partida agora é sorteado aleatoriamente." },
      { type: 'fix',           text: "Botão de expulsar jogador offline corrigido no lobby e em jogo." },
    ],
  },
  {
    version: "v0.3",
    date: "Mar 2026",
    title: "Mercado Negro & Itens",
    changes: [
      { type: 'novo',     text: "Fase de compras com Mercado Negro ao fim de cada rodada." },
      { type: 'novo',     text: "10 itens craftáveis: Firewall, Zero-Day, Ransomware, Bomba Lógica e mais." },
      { type: 'novo',     text: "Sistema de inventário — itens persistem entre rodadas." },
      { type: 'fix',      text: "Firewall agora bloqueia corretamente Ransomware e Zero-Day." },
    ],
  },
  {
    version: "v0.2",
    date: "Fev 2026",
    title: "Multiplayer Online",
    changes: [
      { type: 'novo',     text: "Salas multiplayer via código — até 8 jogadores simultâneos." },
      { type: 'novo',     text: "Sincronização em tempo real via Supabase Realtime." },
      { type: 'novo',     text: "Detecção de jogadores offline com botão de expulsão." },
      { type: 'melhoria', text: "Log de eventos compartilhado entre todos os jogadores da sala." },
    ],
  },
  {
    version: "v0.1",
    date: "Jan 2026",
    title: "Versão Inicial",
    changes: [
      { type: 'novo', text: "Mecânica core do Saco de Risco: sacar ou passar a vez." },
      { type: 'novo', text: "Curto-Circuito (2× = explosão) e Vírus (2× = congelamento)." },
      { type: 'novo', text: "Sistema de HP — último sobrevivente vence." },
    ],
  },
];
