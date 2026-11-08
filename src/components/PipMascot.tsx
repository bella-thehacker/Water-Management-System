import React from 'react';
import { motion } from 'motion/react';

export type PipState =
  | 'idle'
  | 'jumping'
  | 'celebrating'
  | 'loading'
  | 'clipboard'
  | 'searching'
  | 'document';

interface PipMascotProps {
  state?: PipState;
  size?: number;
  className?: string;
  showRipple?: boolean;
}

export const PipMascot: React.FC<PipMascotProps> = ({
  state = 'idle',
  size = 120,
  className = '',
  showRipple = true,
}) => {
  // Motion variants based on state
  const jumpVariants = {
    idle: {
      y: [0, -4, 0],
      transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const },
    },
    jumping: {
      y: [0, -28, 0, -12, 0],
      scale: [1, 1.08, 0.95, 1.03, 1],
      transition: { duration: 0.8, ease: 'easeOut' as const },
    },
    celebrating: {
      y: [0, -20, 0, -10, 0],
      rotate: [0, -5, 5, -3, 0],
      transition: { duration: 0.9, repeat: 2 },
    },
    loading: {
      y: [0, -14, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      {/* Floating Mascot */}
      <motion.div
        variants={jumpVariants}
        animate={state === 'jumping' || state === 'celebrating' ? state : state === 'loading' ? 'loading' : 'idle'}
        className="relative z-10"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md select-none"
        >
          <defs>
            {/* Pip Body Gradient */}
            <linearGradient id="pipBodyGrad" x1="20" y1="10" x2="80" y2="105" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.6" stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>

            {/* Glossy Top Reflection */}
            <linearGradient id="pipGloss" x1="35" y1="18" x2="55" y2="55" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Cheek blush */}
            <radialGradient id="pipBlush" cx="50%" cy="50%" r="50%">
              <stop stopColor="#FB7185" stopOpacity="0.45" />
              <stop offset="1" stopColor="#FB7185" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Droplet Body */}
          <path
            d="M 50 12 
               C 50 12, 78 48, 78 72 
               C 78 88.5, 65.5 100, 50 100 
               C 34.5 100, 22 88.5, 22 72 
               C 22 48, 50 12, 50 12 Z"
            fill="url(#pipBodyGrad)"
            stroke="#0369A1"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Highlight / Gloss */}
          <path
            d="M 47 22 
               C 47 22, 33 46, 31 66 
               C 30 73, 31 77, 34 81 
               C 32 75, 33 60, 44 38 
               C 47 32, 48 26, 47 22 Z"
            fill="url(#pipGloss)"
          />

          {/* Cheeks */}
          <ellipse cx="34" cy="74" rx="4.5" ry="3" fill="url(#pipBlush)" />
          <ellipse cx="66" cy="74" rx="4.5" ry="3" fill="url(#pipBlush)" />

          {/* Eyes based on state */}
          {state === 'celebrating' || state === 'jumping' ? (
            /* Happy Closed Eyes (Joy arcs) */
            <g stroke="#082F49" strokeWidth="2.4" strokeLinecap="round">
              <path d="M 35 66 Q 40 60 45 66" />
              <path d="M 55 66 Q 60 60 65 66" />
            </g>
          ) : (
            /* Open Inquiring Eyes */
            <g fill="#082F49">
              {/* Left Eye */}
              <circle cx="40" cy="64" r="3.4" />
              <circle cx="39" cy="62.5" r="1.1" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="60" cy="64" r="3.4" />
              <circle cx="59" cy="62.5" r="1.1" fill="#FFFFFF" />
            </g>
          )}

          {/* Mouth */}
          {state === 'celebrating' || state === 'jumping' ? (
            <path
              d="M 45 74 Q 50 82 55 74 Z"
              fill="#BE123C"
              stroke="#082F49"
              strokeWidth="1.2"
            />
          ) : (
            <path
              d="M 46 73 Q 50 78 54 73"
              fill="none"
              stroke="#082F49"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* PROPS DEPENDING ON STATE */}

          {/* Magnifying Glass (Searching empty state) */}
          {state === 'searching' && (
            <g transform="translate(56, 52) rotate(15)">
              <circle
                cx="14"
                cy="14"
                r="10"
                fill="#E0F2FE"
                fillOpacity="0.75"
                stroke="#0284C7"
                strokeWidth="2.5"
              />
              <line
                x1="21"
                y1="21"
                x2="32"
                y2="32"
                stroke="#0369A1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 10 10 Q 14 7 18 10"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Clipboard (Customers empty state) */}
          {state === 'clipboard' && (
            <g transform="translate(14, 55) rotate(-8)">
              {/* Board */}
              <rect
                x="0"
                y="0"
                width="24"
                height="32"
                rx="3"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="1.5"
              />
              {/* Paper */}
              <rect x="3" y="5" width="18" height="24" rx="1.5" fill="#FFFFFF" />
              {/* Clip */}
              <rect x="7" y="-2" width="10" height="5" rx="1.5" fill="#64748B" />
              {/* Check lines */}
              <line x1="6" y1="10" x2="18" y2="10" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="6" y1="15" x2="16" y2="15" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="6" y1="20" x2="17" y2="20" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="6" y1="24" x2="14" y2="24" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}

          {/* Document / Invoice prop */}
          {state === 'document' && (
            <g transform="translate(56, 56) rotate(6)">
              <rect
                x="0"
                y="0"
                width="20"
                height="28"
                rx="2"
                fill="#FFFFFF"
                stroke="#0284C7"
                strokeWidth="1.5"
              />
              {/* Invoice lines */}
              <line x1="4" y1="6" x2="16" y2="6" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="11" x2="14" y2="11" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
              <line x1="4" y1="15" x2="16" y2="15" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
              <line x1="4" y1="19" x2="12" y2="19" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
              <circle cx="14" cy="22" r="2.5" fill="#38BDF8" />
            </g>
          )}

          {/* Celebration Sparkles */}
          {(state === 'celebrating' || state === 'jumping') && (
            <g>
              <circle cx="20" cy="30" r="2.5" fill="#38BDF8" opacity="0.9" />
              <circle cx="80" cy="25" r="3" fill="#0EA5E9" opacity="0.9" />
              <circle cx="88" cy="50" r="2" fill="#38BDF8" opacity="0.8" />
              <path
                d="M 16 48 L 18 52 L 22 54 L 18 56 L 16 60 L 14 56 L 10 54 L 14 52 Z"
                fill="#F59E0B"
              />
              <path
                d="M 82 78 L 83.5 81 L 86.5 82.5 L 83.5 84 L 82 87 L 80.5 84 L 77.5 82.5 L 80.5 81 Z"
                fill="#10B981"
              />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Water Ripple Ground Effect */}
      {showRipple && (
        <div className="relative -mt-2 w-16 h-3 flex items-center justify-center select-none">
          {/* Base shadow */}
          <motion.div
            animate={{
              scale: state === 'loading' ? [1, 0.8, 1] : [1, 0.9, 1],
              opacity: [0.35, 0.2, 0.35],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-2 bg-[#0284C7]/20 rounded-full blur-[1px]"
          />

          {/* Expanding Ripple for loading or jumping */}
          {(state === 'loading' || state === 'jumping') && (
            <motion.div
              animate={{
                scale: [1, 2.4],
                opacity: [0.6, 0],
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute w-10 h-2 border border-[#38BDF8] rounded-full"
            />
          )}
        </div>
      )}
    </div>
  );
};
