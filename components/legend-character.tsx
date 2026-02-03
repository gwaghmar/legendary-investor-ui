'use client';

import { motion } from 'framer-motion';
import type { Legend } from '@/lib/legends';

interface LegendCharacterProps {
  legend: Legend;
  isActive?: boolean;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LegendCharacter({
  legend,
  isActive = false,
  isSpeaking = false,
  size = 'md',
}: LegendCharacterProps) {
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-20 h-24',
    lg: 'w-24 h-28',
  };

  const svgSizes = {
    sm: { width: 50, height: 65 },
    md: { width: 60, height: 75 },
    lg: { width: 70, height: 85 },
  };

  const { width, height } = svgSizes[size];

  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer relative group"
      animate={{
        opacity: isActive ? 1 : 0.5,
        scale: isActive ? 1.05 : 1,
        y: isActive ? -5 : 0,
      }}
      whileHover={{ opacity: 1, scale: 1.05, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Active Indicator / Glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-current opacity-20 blur-xl z-0"
          layoutId="active-glow"
          style={{ color: legend.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
        />
      )}

      <motion.div
        className={`${sizeClasses[size]} flex items-center justify-center border-2 border-foreground bg-background relative z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]`}
        style={{ color: legend.color, borderColor: 'currentColor' }}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Head */}
          <circle cx="30" cy="15" r="12" />

          {/* Eyes */}
          <circle cx="26" cy="13" r="1.5" fill="currentColor" />
          <circle cx="34" cy="13" r="1.5" fill="currentColor" />

          {/* Mouth - Animated */}
          <motion.ellipse
            cx="30"
            cy="19"
            rx="3"
            ry={1}
            animate={{
              ry: isSpeaking ? [1, 3, 1] : 1,
            }}
            transition={{
              repeat: isSpeaking ? Infinity : 0,
              duration: 0.2,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: '30px 19px' }}
          />

          {/* Body */}
          <line x1="30" y1="27" x2="30" y2="50" />

          {/* Left Arm - Gesturing */}
          <motion.line
            x1="30"
            y1="35"
            x2="15"
            y2="45"
            animate={{
              y2: isSpeaking ? [45, 25, 45] : 45,
            }}
            transition={{
              repeat: isSpeaking ? Infinity : 0,
              repeatType: "reverse",
              duration: 0.5,
              ease: "easeInOut"
            }}
          />

          {/* Right Arm */}
          <line x1="30" y1="35" x2="45" y2="45" />

          {/* Left Leg */}
          <line x1="30" y1="50" x2="20" y2="70" />

          {/* Right Leg */}
          <line x1="30" y1="50" x2="40" y2="70" />
        </svg>
      </motion.div>
      
      <span
        className="text-xs font-bold uppercase tracking-tight z-10 bg-background/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-transparent group-hover:border-foreground/20 transition-colors"
        style={{ color: isActive ? legend.color : undefined }}
      >
        {legend.name}
      </span>
    </motion.div>
  );
}
