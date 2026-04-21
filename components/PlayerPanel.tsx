"use client";

import { SHOP_ITEMS } from "@/lib/items";
import { motion } from "framer-motion";

// ─── 3D-style SVG icons ────────────────────────────────────────────────────────
const ITEM_ICONS_3D: Record<string, (dim: boolean) => React.ReactNode> = {

  firewall: (dim) => {
    const base  = dim ? 'rgba(59,130,246,0.25)' : '#3b82f6';
    const light = dim ? 'rgba(147,197,253,0.2)'  : '#93c5fd';
    const dark  = dim ? 'rgba(29,78,216,0.2)'    : '#1d4ed8';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="45" rx="10" ry="2.5" fill="rgba(0,0,0,0.4)" />
        <path d="M24 5 L38 12 L38 28 C38 37 24 44 24 44 C24 44 10 37 10 28 L10 12 Z" fill={dark} />
        <path d="M24 8 L36 14 L36 28 C36 35.5 24 41.5 24 41.5 C24 41.5 12 35.5 12 28 L12 14 Z" fill={base} />
        <path d="M24 8 L36 14 L24 20 L12 14 Z" fill={light} opacity="0.7" />
        <path d="M16 18 L19 16.5 L19 32 L16 33.5 Z" fill="white" opacity={dim ? 0.04 : 0.2} />
        <rect x="20" y="26" width="8" height="7" rx="1.5" fill={dark} opacity="0.9" />
        <path d="M21.5 26 C21.5 23.5 26.5 23.5 26.5 26" stroke={light} strokeWidth="2" fill="none" />
        <circle cx="24" cy="29.5" r="1.2" fill={light} />
      </svg>
    );
  },

  patch: (dim) => {
    const base  = dim ? 'rgba(34,197,94,0.25)'  : '#22c55e';
    const light = dim ? 'rgba(134,239,172,0.2)'  : '#86efac';
    const dark  = dim ? 'rgba(21,128,61,0.2)'    : '#15803d';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="45" rx="8" ry="2" fill="rgba(0,0,0,0.35)" />
        <rect x="10" y="17" width="28" height="16" rx="8" fill={dark} />
        <rect x="11" y="16" width="26" height="14" rx="7" fill={base} />
        <rect x="13" y="18" width="14" height="10" rx="5" fill={light} opacity="0.65" />
        <rect x="20" y="8" width="8" height="10" rx="2" fill={dark} />
        <rect x="21" y="9" width="6" height="8" rx="1.5" fill={base} />
        <rect x="23" y="4" width="2" height="6" rx="1" fill={light} />
        <rect x="14" y="20" width="3" height="8" rx="1.5" fill="white" opacity={dim ? 0.04 : 0.22} />
        <rect x="27" y="21.5" width="6" height="2" rx="1" fill="white" opacity="0.65" />
        <rect x="29" y="19.5" width="2" height="6" rx="1" fill="white" opacity="0.65" />
      </svg>
    );
  },

  vpn: (dim) => {
    const base  = dim ? 'rgba(234,179,8,0.25)'  : '#eab308';
    const light = dim ? 'rgba(253,224,71,0.2)'   : '#fde047';
    const dark  = dim ? 'rgba(146,64,14,0.2)'    : '#92400e';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="45" rx="9" ry="2.2" fill="rgba(0,0,0,0.35)" />
        <circle cx="24" cy="22" r="16" fill={dark} />
        <circle cx="24" cy="22" r="15" fill={base} />
        <ellipse cx="24" cy="22" rx="15" ry="5.5" fill="none" stroke={dark} strokeWidth="1.2" opacity="0.5" />
        <ellipse cx="24" cy="22" rx="15" ry="10" fill="none" stroke={dark} strokeWidth="0.8" opacity="0.4" />
        <line x1="24" y1="7" x2="24" y2="37" stroke={dark} strokeWidth="1" opacity="0.5" />
        <path d="M24 7 C31 14 31 30 24 37 C17 30 17 14 24 7" fill="none" stroke={dark} strokeWidth="0.9" opacity="0.4" />
        <ellipse cx="19" cy="15" rx="5" ry="3" fill={light} opacity="0.5" transform="rotate(-20 19 15)" />
        <circle cx="24" cy="22" r="5.5" fill={dark} opacity="0.85" />
        <rect x="21.5" y="22" width="5" height="4.5" rx="1" fill={light} />
        <path d="M22.5 22 C22.5 19.8 25.5 19.8 25.5 22" stroke={light} strokeWidth="1.6" fill="none" />
      </svg>
    );
  },

  trojan: (dim) => {
    const base  = dim ? 'rgba(249,115,22,0.25)'  : '#f97316';
    const light = dim ? 'rgba(253,186,116,0.2)'   : '#fdba74';
    const dark  = dim ? 'rgba(154,52,18,0.2)'     : '#9a3412';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="45" rx="11" ry="2.5" fill="rgba(0,0,0,0.35)" />
        <path d="M8 28 L24 36 L40 28 L40 39 L24 47 L8 39 Z" fill={dark} />
        <path d="M8 18 L8 28 L24 36 L24 26 Z" fill={base} opacity="0.85" />
        <path d="M40 18 L40 28 L24 36 L24 26 Z" fill={dark} opacity="0.9" />
        <path d="M8 18 L24 10 L40 18 L24 26 Z" fill={light} opacity="0.75" />
        <line x1="16" y1="18" x2="32" y2="18" stroke={dark} strokeWidth="1.3" opacity="0.55" />
        <line x1="24" y1="12" x2="24" y2="24" stroke={dark} strokeWidth="1.3" opacity="0.55" />
        <circle cx="24" cy="18" r="3.5" fill={dark} opacity="0.7" />
        <circle cx="24" cy="18" r="1.5" fill={light} />
        <path d="M9.5 19 L12.5 17.5 L12.5 27 L9.5 28.5 Z" fill="white" opacity={dim ? 0.03 : 0.14} />
      </svg>
    );
  },

  phishing: (dim) => {
    const base  = dim ? 'rgba(249,115,22,0.25)'  : '#f97316';
    const light = dim ? 'rgba(253,186,116,0.2)'   : '#fdba74';
    const dark  = dim ? 'rgba(154,52,18,0.2)'     : '#9a3412';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="46" rx="7" ry="1.8" fill="rgba(0,0,0,0.3)" />
        <ellipse cx="24" cy="18" rx="16" ry="5" fill="none" stroke={dark} strokeWidth="2.8" opacity="0.45" />
        <ellipse cx="24" cy="18" rx="11" ry="3.5" fill="none" stroke={base} strokeWidth="2.8" opacity="0.75" />
        <ellipse cx="24" cy="18" rx="6" ry="2" fill="none" stroke={light} strokeWidth="2.8" />
        <rect x="23" y="18" width="2" height="18" rx="1" fill={base} />
        <path d="M25 36 C25 40.5 31 40.5 31 36 C31 33 29 32 27.5 33.5" stroke={light} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <rect x="18.5" y="30" width="9" height="7" rx="1.5" fill={dark} />
        <rect x="19.5" y="31" width="7" height="5" rx="1" fill={base} />
        <line x1="20" y1="33" x2="26" y2="33" stroke={light} strokeWidth="0.9" opacity="0.7" />
        <line x1="20" y1="35" x2="24.5" y2="35" stroke={light} strokeWidth="0.9" opacity="0.5" />
      </svg>
    );
  },

  reboot: (dim) => {
    const base  = dim ? 'rgba(234,179,8,0.25)'  : '#eab308';
    const light = dim ? 'rgba(253,224,71,0.2)'   : '#fde047';
    const dark  = dim ? 'rgba(146,64,14,0.2)'    : '#92400e';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="45" rx="11" ry="2.8" fill="rgba(0,0,0,0.35)" />
        <ellipse cx="24" cy="35" rx="14" ry="4.5" fill={dark} />
        <ellipse cx="24" cy="31" rx="14" ry="4.5" fill={base} />
        <path d="M10 31 L10 35 L24 39.5 L38 35 L38 31 L24 35.5 Z" fill={dark} opacity="0.65" />
        <path d="M15 29 A10 10 0 1 1 33 29" stroke={light} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <polygon points="33,26 38,30 29,31" fill={light} />
        <circle cx="24" cy="31" r="3.5" fill={dark} />
        <circle cx="24" cy="31" r="1.8" fill={light} opacity="0.85" />
      </svg>
    );
  },

  zeroday: (dim) => {
    const base  = dim ? 'rgba(239,68,68,0.25)'  : '#ef4444';
    const light = dim ? 'rgba(252,165,165,0.2)'  : '#fca5a5';
    const dark  = dim ? 'rgba(127,29,29,0.2)'    : '#7f1d1d';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="46" rx="9" ry="2.2" fill="rgba(0,0,0,0.4)" />
        <ellipse cx="24" cy="22" rx="13.5" ry="14.5" fill={dark} />
        <ellipse cx="24" cy="21" rx="12.5" ry="13.5" fill={base} />
        <ellipse cx="19" cy="14" rx="4.5" ry="3.5" fill={light} opacity="0.4" transform="rotate(-15 19 14)" />
        <ellipse cx="19.5" cy="22" rx="3.5" ry="4.5" fill={dark} />
        <ellipse cx="28.5" cy="22" rx="3.5" ry="4.5" fill={dark} />
        <ellipse cx="19" cy="21.5" rx="1.8" ry="2.5" fill={light} opacity="0.25" />
        <ellipse cx="28" cy="21.5" rx="1.8" ry="2.5" fill={light} opacity="0.25" />
        <path d="M22.5 27.5 L24 31 L25.5 27.5 Z" fill={dark} />
        <rect x="14" y="33" width="20" height="5.5" rx="2" fill={dark} />
        <rect x="16" y="34" width="3.5" height="4.5" rx="1" fill={base} opacity="0.55" />
        <rect x="21" y="34" width="3.5" height="4.5" rx="1" fill={base} opacity="0.55" />
        <rect x="26" y="34" width="3.5" height="4.5" rx="1" fill={base} opacity="0.55" />
      </svg>
    );
  },

  ddos: (dim) => {
    const base  = dim ? 'rgba(239,68,68,0.25)'  : '#ef4444';
    const light = dim ? 'rgba(252,165,165,0.2)'  : '#fca5a5';
    const dark  = dim ? 'rgba(127,29,29,0.2)'    : '#7f1d1d';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="46" rx="11" ry="2.5" fill="rgba(0,0,0,0.35)" />
        {/* Server 1 */}
        <path d="M6 35 L6 40 L22 44.5 L38 40 L38 35 L22 39.5 Z" fill={dark} />
        <path d="M6 31 L22 35.5 L38 31 L22 26.5 Z" fill={light} opacity="0.55" />
        <path d="M6 31 L6 35 L22 39.5 L22 35.5 Z" fill={base} opacity="0.8" />
        <path d="M38 31 L38 35 L22 39.5 L22 35.5 Z" fill={dark} opacity="0.75" />
        {/* Server 2 */}
        <path d="M6 22 L6 27 L22 31.5 L38 27 L38 22 L22 17.5 Z" fill={dark} opacity="0.7" />
        <path d="M6 18 L22 22.5 L38 18 L22 13.5 Z" fill={light} opacity="0.45" />
        <path d="M6 18 L6 22 L22 26.5 L22 22.5 Z" fill={base} opacity="0.6" />
        {/* Status LEDs */}
        <circle cx="12" cy="33" r="1.8" fill={light} />
        <circle cx="17" cy="33" r="1.8" fill="#fbbf24" />
        <circle cx="12" cy="25" r="1.8" fill={base} />
        {/* Lightning hits */}
        <path d="M32 4 L28 13 L33 13 L28 22" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M40 7 L37 14 L41 14 L37 21" stroke="#fbbf24" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />
      </svg>
    );
  },

  ransomware: (dim) => {
    const base  = dim ? 'rgba(239,68,68,0.25)'  : '#ef4444';
    const light = dim ? 'rgba(252,165,165,0.2)'  : '#fca5a5';
    const dark  = dim ? 'rgba(127,29,29,0.2)'    : '#7f1d1d';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="46" rx="10" ry="2.5" fill="rgba(0,0,0,0.35)" />
        <path d="M16 22 C16 11.5 32 11.5 32 22" stroke={dark} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M17 22 C17 13 31 13 31 22" stroke={base} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M11 26 L11 41 L24 45.5 L37 41 L37 26 L24 21.5 Z" fill={dark} />
        <path d="M11 22 L11 37 L24 41.5 L37 37 L37 22 L24 17.5 Z" fill={base} />
        <path d="M11 22 L24 17.5 L37 22 L24 26.5 Z" fill={light} opacity="0.6" />
        <circle cx="24" cy="29.5" r="4.5" fill={dark} />
        <rect x="22.5" y="29.5" width="3" height="5.5" rx="1" fill={dark} />
        <circle cx="24" cy="29" r="2.5" fill={light} opacity="0.5" />
        <path d="M13 23 L16 21.5 L16 35 L13 36.5 Z" fill="white" opacity={dim ? 0.03 : 0.12} />
      </svg>
    );
  },

  logicbomb: (dim) => {
    const base  = dim ? 'rgba(239,68,68,0.25)'  : '#ef4444';
    const light = dim ? 'rgba(252,165,165,0.2)'  : '#fca5a5';
    const dark  = dim ? 'rgba(127,29,29,0.2)'    : '#7f1d1d';
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="46" rx="11" ry="2.8" fill="rgba(0,0,0,0.4)" />
        <circle cx="24" cy="29" r="14.5" fill={dark} />
        <circle cx="24" cy="28" r="13.5" fill={base} />
        <ellipse cx="19" cy="20" rx="5.5" ry="4" fill={light} opacity="0.42" transform="rotate(-20 19 20)" />
        <ellipse cx="24" cy="28" rx="13.5" ry="4.5" fill={dark} opacity="0.28" />
        <path d="M28 15 C33 9.5 37 7.5 35 4.5" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="34.5" cy="4.5" r="3" fill="#fbbf24" />
        <path d="M31.5 2.5 L35 5.5 M37 2.5 L33.5 5.5 M36 0.5 L35 4" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M20 23 L24 29.5 L22 29.5 L26 36" stroke={light} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85" />
      </svg>
    );
  },
};

// ─── TYPE CONFIG ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, { color: string; border: string; bg: string; headerBg: string; label: string }> = {
  defense:  { color: '#3b82f6', border: 'rgba(59,130,246,0.5)',  bg: 'rgba(59,130,246,0.07)',  headerBg: 'rgba(59,130,246,0.22)',  label: 'DEF'   },
  heal:     { color: '#22c55e', border: 'rgba(34,197,94,0.5)',   bg: 'rgba(34,197,94,0.07)',   headerBg: 'rgba(34,197,94,0.22)',   label: 'HEAL'  },
  utility:  { color: '#eab308', border: 'rgba(234,179,8,0.5)',   bg: 'rgba(234,179,8,0.07)',   headerBg: 'rgba(234,179,8,0.22)',   label: 'UTIL'  },
  attack:   { color: '#f97316', border: 'rgba(249,115,22,0.5)',  bg: 'rgba(249,115,22,0.07)',  headerBg: 'rgba(249,115,22,0.22)',  label: 'ATK'   },
  fatal:    { color: '#ef4444', border: 'rgba(239,68,68,0.55)',  bg: 'rgba(239,68,68,0.08)',   headerBg: 'rgba(239,68,68,0.28)',   label: 'FATAL' },
};

const SUITS = ['◈', '◇', '◆', '○'];

export default function PlayerPanel({
  player, meId, isActive, isDead, isOffline, targetingItem, isTargetable,
  onTarget, onItemClick, isProcessing, isMyTurn
}: any) {
  const isMe = player.id === meId;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => isTargetable && onTarget(targetingItem, player.id)}
      className={`cyber-card corner-tl corner-br relative transition-all duration-300 ${
        isDead ? 'opacity-25 grayscale'
        : isTargetable ? 'cursor-pointer'
        : isActive ? 'is-active-turn'
        : ''
      }`}
      style={isTargetable ? { borderColor: '#ff3333', boxShadow: '0 0 25px rgba(255,51,51,0.35)' } : undefined}
    >
      {isActive && !isDead && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l"
          style={{ background: 'linear-gradient(180deg, transparent, #d4a853, transparent)' }} />
      )}
      {isTargetable && (
        <motion.div
          className="absolute inset-0 rounded-[8px] pointer-events-none z-10"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,51,51,0.1) 0%, transparent 70%)' }}
        />
      )}

      <div className="p-4">
        {/* Player header */}
        <div className="flex justify-between items-center mb-3 pl-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[16px] tracking-wide"
              style={{ fontFamily: 'var(--font-ui)', color: isActive ? '#d4a853' : '#e8edf2' }}>
              {player.name}
            </span>
            {isMe && <span className="section-label px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,168,83,0.1)', color: '#d4a853' }}>YOU</span>}
            {isOffline && !isDead && <span className="section-label px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,68,68,0.1)', color: '#ff4444' }}>OFF</span>}
            {!isOffline && !isDead && <span className="w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />}
          </div>
          <div className="hp-display">
            <span className="section-label" style={{ color: '#d4a853' }}>HP</span>
            <span className="mono font-bold text-lg leading-none" style={{ color: player.hp <= 1 ? '#ff3333' : '#e8edf2' }}>{player.hp}</span>
          </div>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-3 gap-2 pl-1">
          <div className="res-badge" style={{ borderBottomColor: 'rgba(0,255,136,0.5)' }}>
            <span className="mono font-bold text-lg" style={{ color: '#00ff88' }}>{player.greens}</span>
            <span className="section-label" style={{ color: 'rgba(0,255,136,0.5)' }}>PCB</span>
          </div>
          <div className="res-badge" style={{ borderBottomColor: 'rgba(0,170,255,0.5)' }}>
            <span className="mono font-bold text-lg" style={{ color: '#00aaff' }}>{player.blues}</span>
            <span className="section-label" style={{ color: 'rgba(0,170,255,0.5)' }}>BLUE</span>
          </div>
          <div className="res-badge" style={{ borderBottomColor: 'rgba(234,179,8,0.5)' }}>
            <span className="mono font-bold text-lg" style={{ color: '#eab308' }}>{player.batteries}</span>
            <span className="section-label" style={{ color: 'rgba(234,179,8,0.5)' }}>BAT</span>
          </div>
        </div>

        {/* ── TCG Inventory Cards ── */}
        {(player.inventory || []).length > 0 && (
          <div className="pl-1 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="section-label mb-3">Hardwares</p>
            <div className="flex flex-wrap gap-2">
              {player.inventory.map((itemId: string, i: number) => {
                const itemDef   = SHOP_ITEMS.find(x => x.id === itemId);
                const isPassive = itemDef?.type === 'defense';
                const isTgt     = targetingItem === itemId;
                const canUse    = isMyTurn && isMe && !isPassive && !isProcessing;
                const cfg       = itemDef ? (TYPE_CONFIG[itemDef.type] || TYPE_CONFIG.utility) : TYPE_CONFIG.utility;
                const suit      = SUITS[i % SUITS.length];
                const icon3d    = ITEM_ICONS_3D[itemId] || ITEM_ICONS_3D['firewall'];

                return (
                  <motion.button
                    key={`${itemId}-${i}`}
                    whileHover={canUse ? { y: -14, scale: 1.08, rotateZ: 1 } : {}}
                    whileTap={canUse ? { scale: 0.93 } : {}}
                    disabled={!canUse}
                    onClick={e => { e.stopPropagation(); canUse && onItemClick(itemId); }}
                    className={`relative flex flex-col overflow-hidden transition-all
                      ${canUse ? 'cursor-pointer' : isPassive ? 'opacity-60 cursor-not-allowed' : 'opacity-35 cursor-not-allowed'}
                    `}
                    style={{
                      width: 84,
                      height: 126,
                      borderRadius: 10,
                      background: isTgt
                        ? 'rgba(255,51,51,0.12)'
                        : `linear-gradient(180deg, ${cfg.bg} 0%, var(--bg-card) 50%)`,
                      border: `1px solid ${isTgt ? '#ff3333' : canUse ? cfg.border : 'rgba(255,255,255,0.07)'}`,
                      boxShadow: isTgt
                        ? '0 0 20px rgba(255,51,51,0.4)'
                        : canUse
                          ? `0 8px 28px ${cfg.color}30, inset 0 1px 0 ${cfg.color}22`
                          : 'none',
                      animation: isTgt ? 'redFlash 1s ease-in-out infinite' : 'none',
                    }}
                  >
                    {/* ── TOP: Card name (like TCG card name at top) ── */}
                    <div
                      className="flex items-center justify-between px-1.5 py-1 flex-shrink-0"
                      style={{
                        background: canUse ? cfg.headerBg : 'rgba(255,255,255,0.03)',
                        borderBottom: `1px solid ${canUse ? `${cfg.color}30` : 'rgba(255,255,255,0.05)'}`,
                      }}
                    >
                      <span
                        className="font-bold uppercase leading-none truncate"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 6.5,
                          letterSpacing: '0.05em',
                          color: canUse ? '#e8edf2' : 'rgba(255,255,255,0.22)',
                          maxWidth: 54,
                        }}
                      >
                        {itemDef?.name || itemId}
                      </span>
                      <span className="mono flex-shrink-0" style={{ fontSize: 7, color: canUse ? `${cfg.color}90` : 'rgba(255,255,255,0.1)' }}>
                        {suit}
                      </span>
                    </div>

                    {/* ── CENTRE ART: big 3D icon taking most of the card ── */}
                    <div
                      className="flex-1 flex items-center justify-center px-1.5 py-1.5"
                      style={{ minHeight: 0 }}
                    >
                      <div style={{ width: '100%', height: '100%', maxHeight: 70 }}>
                        {icon3d(!canUse)}
                      </div>
                    </div>

                    {/* ── BOTTOM: type label + cost — like TCG description box ── */}
                    <div
                      className="flex flex-col items-center gap-0.5 px-1.5 py-1 flex-shrink-0"
                      style={{
                        borderTop: `1px solid ${canUse ? `${cfg.color}25` : 'rgba(255,255,255,0.04)'}`,
                        background: canUse ? `${cfg.color}0a` : 'transparent',
                      }}
                    >
                      <span
                        className="section-label"
                        style={{
                          fontSize: 6,
                          letterSpacing: '0.14em',
                          color: canUse ? cfg.color : 'rgba(255,255,255,0.18)',
                        }}
                      >
                        {cfg.label}
                      </span>
                      <div className="flex items-center gap-0.5 justify-center">
                        {itemDef && itemDef.cost.green  > 0 && <span className="mono" style={{ fontSize: 6, color: canUse ? '#00ff8899' : 'rgba(0,255,136,0.15)' }}>{itemDef.cost.green}G</span>}
                        {itemDef && itemDef.cost.blue   > 0 && <span className="mono" style={{ fontSize: 6, color: canUse ? '#00aaff99' : 'rgba(0,170,255,0.15)' }}>{itemDef.cost.blue}B</span>}
                        {itemDef && itemDef.cost.yellow > 0 && <span className="mono" style={{ fontSize: 6, color: canUse ? '#eab30899' : 'rgba(234,179,8,0.15)'  }}>{itemDef.cost.yellow}Y</span>}
                      </div>
                    </div>

                    {/* ── Holographic sheen ── */}
                    {canUse && (
                      <div className="absolute inset-0 pointer-events-none" style={{
                        borderRadius: 10,
                        background: `linear-gradient(135deg, ${cfg.color}09 0%, transparent 45%, ${cfg.color}06 100%)`,
                      }} />
                    )}

                    {/* ── Bottom-right rotated suit ── */}
                    <span className="absolute mono" style={{
                      bottom: 22, right: 3, fontSize: 7,
                      color: canUse ? `${cfg.color}28` : 'rgba(255,255,255,0.05)',
                      transform: 'rotate(180deg)',
                    }}>
                      {suit}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
