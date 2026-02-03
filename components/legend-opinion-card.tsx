'use client';

import { legends, sentimentColors, sentimentLabels, type LegendId, type Sentiment } from '@/lib/legends';

interface LegendOpinionCardProps {
  legendId: LegendId;
  sentiment: Sentiment;
  opinion: string;
  action: string;
}

export function LegendOpinionCard({
  legendId,
  sentiment,
  opinion,
  action,
}: LegendOpinionCardProps) {
  const legend = legends[legendId];
  const sentimentColor = sentimentColors[sentiment];
  const sentimentLabel = sentimentLabels[sentiment];

  return (
    <div
      className="border-2 p-4 sm:p-6"
      style={{
        borderColor: sentimentColor,
        backgroundColor: `${sentimentColor}08`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{legend.emoji}</span>
          <span className="font-bold uppercase" style={{ color: legend.color }}>
            {legend.fullName}
          </span>
        </div>
        <span
          className="text-xs font-bold px-2 py-1"
          style={{
            backgroundColor: sentimentColor,
            color: '#FFFFFF',
          }}
        >
          {sentimentLabel}
        </span>
      </div>

      <p className="text-sm leading-relaxed mb-4">
        &ldquo;{opinion}&rdquo;
      </p>

      <div className="flex items-center gap-2 text-sm border-t border-foreground/20 pt-4">
        <span className="font-bold">Action:</span>
        <span>{action}</span>
      </div>
    </div>
  );
}
