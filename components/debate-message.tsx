'use client';

import { useEffect, useState } from 'react';
import { legends, type LegendId } from '@/lib/legends';

interface DebateMessageProps {
  legendId: LegendId | 'user';
  message: string;
  isLatest?: boolean;
  isLeft?: boolean;
  animate?: boolean;
  verdict?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export function DebateMessage({
  legendId,
  message,
  isLatest = false,
  isLeft = true,
  animate = false,
  verdict,
}: DebateMessageProps) {
  const legend = legendId === 'user'
    ? { color: '#3B82F6', avatar: '/avatars/user.png', fullName: 'You' }
    : legends[legendId];

  const [displayedText, setDisplayedText] = useState(animate ? '' : message);
  const [isTyping, setIsTyping] = useState(animate);

  useEffect(() => {
    if (!animate) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedText(message.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [animate, message]);

  const verdictColors = {
    BULLISH: 'bg-green-600',
    BEARISH: 'bg-red-600',
    NEUTRAL: 'bg-yellow-600',
  };

  return (
    <div
      className={`flex ${legendId === 'user' ? 'justify-end' : (isLeft ? 'justify-start' : 'justify-end')} animate-fade-in-up`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[70%] border-2 p-4 relative ${isLatest ? '' : 'border-foreground'
          } ${legendId === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600' : ''}`}
        style={{
          borderColor: isLatest && legendId !== 'user' ? legend.color : undefined,
          backgroundColor: legendId === 'user' ? undefined : (isLatest ? `${legend.color}08` : 'transparent'),
        }}
      >
        {/* Header with Legend name and Verdict */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: legend.color }}>
              {legendId === 'user' ? (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">U</div>
              ) : (
                <img src={legend.avatar} alt={legend.fullName} className="w-full h-full object-cover" />
              )}
            </div>
            <span className="font-bold text-sm" style={{ color: legendId === 'user' ? 'inherit' : legend.color }}>
              {legend.fullName}
            </span>
          </div>
          {verdict && legendId !== 'user' && (
            <span className={`text-xs font-bold text-white px-2 py-0.5 rounded ${verdictColors[verdict]}`}>
              {verdict}
            </span>
          )}
        </div>

        {/* Message content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {displayedText}
          {isTyping && <span className="animate-blink">|</span>}
        </p>
      </div>
    </div>
  );
}
