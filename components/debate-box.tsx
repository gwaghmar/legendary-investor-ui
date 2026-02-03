'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DebateMessage } from './debate-message';
import { legends, type LegendId } from '@/lib/legends';

interface Message {
  id: number;
  legendId: LegendId | 'user';
  message: string;
  isUser?: boolean;
  verdict?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence?: number;
}

const debateTopics = [
  {
    topic: "Asian Market Plunge (-5.3%)",
    date: "Feb 2, 2026",
    messages: [
      { legendId: 'burry' as LegendId, message: "Kospi down 5%. Trading halted. I warned you about the leverage in the system. The contagion is just starting." },
      { legendId: 'buffett' as LegendId, message: "Panic in one market usually creates value in another. But I still don't see anything in Seoul I want to own." },
      { legendId: 'druckenmiller' as LegendId, message: "It's a liquidity event. The dollar index (DXY) is ripping. Emerging markets always break first when the Fed stays tight." },
    ],
  },
  {
    topic: "NVIDIA Hits $5 Trillion Market Cap",
    date: "Feb 2, 2026",
    messages: [
      { legendId: 'lynch' as LegendId, message: "I visited the data centers. Every rack has their chips. This isn't hype, it's real demand. But at 60x earnings? Maybe wait for a pullback." },
      { legendId: 'burry' as LegendId, message: "Cisco 2000 vibes. Everyone needs networking equipment... until they don't. The AI spending cycle will peak." },
      { legendId: 'druckenmiller' as LegendId, message: "Momentum is momentum. I'm staying long until the chart breaks. Could easily see $200 before any real correction." },
    ],
  },
  {
    topic: "Bitcoin Breaks $150,000",
    date: "Feb 1, 2026",
    messages: [
      { legendId: 'buffett' as LegendId, message: "Rat poison squared. I don't care if it goes to a million. It produces nothing. I'll stick with See's Candies." },
      { legendId: 'munger' as LegendId, message: "Disgusting. A gambling token dressed up as a currency. The people buying this garbage will regret it." },
      { legendId: 'druckenmiller' as LegendId, message: "I don't love it, but central banks are debasing currencies. BTC is insurance against their stupidity. I own some." },
    ],
  },
  {
    topic: "Fed Holds Rates at 5.5%",
    date: "Jan 31, 2026",
    messages: [
      { legendId: 'druckenmiller' as LegendId, message: "Higher for longer is breaking things. Commercial real estate is next. Watch the regional banks." },
      { legendId: 'buffett' as LegendId, message: "High rates are great for savers and for patient capital. Our cash pile earns 5% while we wait for opportunities." },
      { legendId: 'burry' as LegendId, message: "The Fed is trying to kill inflation but they're killing liquidity. Something will break. Then they pivot. Too late." },
    ],
  },
  {
    topic: "Tesla Robotaxi Launch Delayed Again",
    date: "Feb 1, 2026",
    messages: [
      { legendId: 'munger' as LegendId, message: "Elon promises the world and delivers excuses. This company is a meme, not a business. Short it." },
      { legendId: 'lynch' as LegendId, message: "I see Teslas everywhere. People love the cars. But the valuation assumes they solve ALL problems. Too rich for me." },
      { legendId: 'burry' as LegendId, message: "17th delay on full self-driving. At some point the market will notice the emperor has no clothes." },
    ],
  },
  {
    topic: "Oil Spikes to $95 on OPEC Cuts",
    date: "Jan 30, 2026",
    messages: [
      { legendId: 'druckenmiller' as LegendId, message: "Energy is the trade. OPEC has more power than people think. Oil services names could run 50%+" },
      { legendId: 'buffett' as LegendId, message: "I like energy when it's cheap. At $95, you're paying for someone else's optimism. I'd rather wait." },
      { legendId: 'burry' as LegendId, message: "Geopolitics is the wildcard. If the Middle East escalates, $95 becomes $150 fast. Hedge accordingly." },
    ],
  },
  {
    topic: "Apple Vision Pro 2 Announced",
    date: "Jan 29, 2026",
    messages: [
      { legendId: 'lynch' as LegendId, message: "My grandkids want one. But at $2,500? I'll wait until it's at Costco for $500. Then it's a real product." },
      { legendId: 'buffett' as LegendId, message: "Apple's brand is the moat. If they say spatial computing is the future, people will believe them. But I'm not buying more." },
      { legendId: 'munger' as LegendId, message: "Another gadget for people who are already addicted to screens. At least they'll look silly wearing it." },
    ],
  },
  {
    topic: "China Stimulus: $1 Trillion Infrastructure",
    date: "Jan 28, 2026",
    messages: [
      { legendId: 'druckenmiller' as LegendId, message: "This is huge. Copper, iron ore, emerging market equities. Xi is trying to prevent a hard landing. Follow the money." },
      { legendId: 'burry' as LegendId, message: "More debt on top of a real estate bubble. This isn't stimulus, it's desperation. China's demographics are a time bomb." },
      { legendId: 'buffett' as LegendId, message: "I don't invest in places where the rules can change overnight. China is uninvestable for me, regardless of stimulus." },
    ],
  },
];

export function DebateBox() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingLegend, setTypingLegend] = useState<LegendId | null>(null);
  const [activeLegend, setActiveLegend] = useState<LegendId | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const currentTopic = debateTopics[currentTopicIndex];

  // Load initial messages for the topic
  useEffect(() => {
    setMessages(currentTopic.messages.map((m, i) => ({
      id: i,
      legendId: m.legendId,
      message: m.message
    })));
  }, [currentTopicIndex]);

  // Function to trigger a new message (can be called by timer or interaction)
  const generateNewMessage = async (userMessage?: string) => {
    try {
      // Pick a random legend
      const legendKeys = Object.keys(legends);
      const nextLegendId = legends[legendKeys[Math.floor(Math.random() * legendKeys.length)] as LegendId].id;
      setTypingLegend(nextLegendId as LegendId);

      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentTopic.topic,
          activeLegend: nextLegendId,
          userMessage: userMessage,
          previousMessages: messages.slice(-6).map(m => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.message
          })),
        }),
      });

      const data = await response.json();

      setTypingLegend(null);
      if (data.content) {
        setMessages(prev => [
          ...prev,
          {
            id: messageIdRef.current++,
            legendId: nextLegendId as LegendId,
            message: data.content,
            verdict: data.verdict as 'BULLISH' | 'BEARISH' | 'NEUTRAL',
            confidence: data.confidence
          }
        ]);
        return nextLegendId; // Return who responded
      } else if (data.message) {
        setMessages(prev => [
          ...prev,
          {
            id: messageIdRef.current++,
            legendId: nextLegendId as LegendId,
            message: data.message.content || data.message
          }
        ]);
        return nextLegendId;
      }
    } catch (error) {
      console.error("Failed to fetch debate message", error);
      setTypingLegend(null);
    }
    return null;
  };

  // Generate 3-4 responses from different legends when user asks a question
  const generateMultipleResponses = async (userQuestion: string) => {
    const respondedLegends: string[] = [];
    const numResponses = Math.floor(Math.random() * 2) + 3; // 3-4 responses from different legends!

    for (let i = 0; i < numResponses; i++) {
      await new Promise(resolve => setTimeout(resolve, i === 0 ? 400 : 1000)); // Faster responses
      const responded = await generateNewMessage(userQuestion);
      if (responded) {
        respondedLegends.push(responded);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingLegend]);

  return (
    <div className="w-full flex flex-col gap-4 md:grid md:grid-cols-[1fr_200px]">
      {/* Main Debate Area */}
      <div className="relative flex-1">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="text-xs font-bold uppercase tracking-wider bg-foreground text-background px-2 py-1">
            LIVE DEBATE
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {currentTopic.date}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[500px] overflow-y-auto p-6 space-y-6 border-2 border-foreground bg-background/80 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] scroll-smooth rounded-sm"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={`${msg.id}-${index}`}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <DebateMessage
                  legendId={msg.legendId}
                  message={msg.message}
                  isLatest={index === messages.length - 1}
                  isLeft={index % 2 === 0}
                  animate={false}
                  verdict={msg.verdict}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {typingLegend && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-sm text-muted-foreground p-2 pl-4"
            >
              <span className="text-xl">{legends[typingLegend].emoji}</span>
              <span className="font-semibold text-foreground/80">{legends[typingLegend].fullName} is typing</span>
              <div className="flex space-x-1">
                <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} />
                <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* User Chat Input */}
        <div className="mt-4 relative group">
          <input
            type="text"
            placeholder="Ask the legends anything..."
            className="w-full bg-background border-2 border-foreground px-4 py-3 pr-12 text-sm focus:outline-none placeholder:text-muted-foreground font-mono transition-all group-hover:shadow-[2px_2px_0px_0px_currentColor] focus:shadow-[2px_2px_0px_0px_currentColor]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                const text = input.value.trim();

                if (text) {
                  setMessages(prev => [
                    ...prev,
                    {
                      id: messageIdRef.current++,
                      legendId: 'user',
                      message: text,
                      isUser: true
                    }
                  ]);
                  input.value = '';
                  // Multiple legends respond to user questions!
                  generateMultipleResponses(text);
                }
              }
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold pointer-events-none">
            ↵
          </div>
          <button
            onClick={() => generateNewMessage()}
            disabled={!!typingLegend}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase bg-foreground text-background px-2 py-1 hover:opacity-80 disabled:opacity-50"
          >
            GENERATE
          </button>
        </div>
      </div>

      {/* Topic Sidebar (Ticker Style) */}
      <div className="hidden md:flex flex-col border-2 border-foreground bg-muted/10 h-[500px] mt-8">
        <div className="bg-foreground text-background p-2 font-bold text-center text-xs uppercase tracking-widest">
          Topics Reel
        </div>
        <div className="flex-1 overflow-y-auto">
          {debateTopics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentTopicIndex(idx)}
              className={`w-full text-left p-3 border-b border-foreground/20 hover:bg-foreground/5 transition-colors group ${idx === currentTopicIndex ? 'bg-foreground/10 border-l-4 border-l-foreground' : ''
                }`}
            >
              <div className="text-[10px] font-mono text-muted-foreground mb-1 group-hover:text-foreground">
                {topic.date}
              </div>
              <div className="text-xs font-bold leading-tight uppercase">
                {topic.topic}
              </div>
            </button>
          ))}
          <div className="p-4 text-center text-[10px] text-muted-foreground italic">
            Topics updated hourly via AI Feed
          </div>
        </div>
      </div>

      {/* Export active legend for parent component */}
      <input type="hidden" id="active-legend" value={activeLegend || ''} />
    </div>
  );
}
