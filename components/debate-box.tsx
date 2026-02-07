'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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

interface NewsTopic {
  id: number;
  topic: string;
  fullHeadline: string;
  date: string;
  source: string;
  summary: string;
  url: string;
  related: string;
}

// Fallback topics if API fails
const fallbackTopics: NewsTopic[] = [
  { id: 1, topic: "Market Update", fullHeadline: "Markets react to latest economic data", date: "Today", source: "Demo", summary: "", url: "", related: "" },
  { id: 2, topic: "Tech Sector News", fullHeadline: "Technology stocks show mixed performance", date: "Today", source: "Demo", summary: "", url: "", related: "" },
  { id: 3, topic: "Federal Reserve Update", fullHeadline: "Fed officials signal policy direction", date: "Today", source: "Demo", summary: "", url: "", related: "" },
];

export function DebateBox() {
  const [newsTopics, setNewsTopics] = useState<NewsTopic[]>(fallbackTopics);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingLegend, setTypingLegend] = useState<LegendId | null>(null);
  const [activeLegend, setActiveLegend] = useState<LegendId | null>(null);
  const [isGeneratingInitial, setIsGeneratingInitial] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const currentTopic = newsTopics[currentTopicIndex];

  // Fetch real news on mount
  useEffect(() => {
    async function fetchNews() {
      try {
        setIsLoadingNews(true);
        const res = await fetch('/api/news');
        const data = await res.json();

        if (data.success && data.news?.length > 0) {
          setNewsTopics(data.news);
          setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoadingNews(false);
      }
    }
    fetchNews();
  }, []);

  // Generate initial AI responses when topic changes
  const generateInitialResponses = useCallback(async (topic: NewsTopic) => {
    setIsGeneratingInitial(true);
    setMessages([]);

    // Pick 3 random legends to respond
    const legendKeys = Object.keys(legends) as LegendId[];
    const selectedLegends = legendKeys.sort(() => Math.random() - 0.5).slice(0, 3);

    for (const legendId of selectedLegends) {
      setTypingLegend(legendId);

      try {
        const response = await fetch('/api/debate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topic.fullHeadline,
            activeLegend: legendId,
            userMessage: null,
            previousMessages: [],
            context: topic.summary || topic.fullHeadline,
          }),
        });

        const data = await response.json();

        if (data.content || data.message) {
          setMessages(prev => [
            ...prev,
            {
              id: messageIdRef.current++,
              legendId: legendId,
              message: data.content || data.message?.content || data.message,
              verdict: data.verdict as 'BULLISH' | 'BEARISH' | 'NEUTRAL',
              confidence: data.confidence
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to generate response:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTypingLegend(null);
    setIsGeneratingInitial(false);
  }, []);

  // When topic changes, generate new responses
  useEffect(() => {
    if (currentTopic && !isLoadingNews) {
      generateInitialResponses(currentTopic);
    }
  }, [currentTopicIndex, isLoadingNews]);

  // Function to trigger a new message
  const generateNewMessage = async (userMessage?: string) => {
    try {
      const legendKeys = Object.keys(legends);
      const nextLegendId = legends[legendKeys[Math.floor(Math.random() * legendKeys.length)] as LegendId].id;
      setTypingLegend(nextLegendId as LegendId);

      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentTopic.fullHeadline,
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
        return nextLegendId;
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

  // Generate multiple responses
  const generateMultipleResponses = async (userQuestion: string) => {
    const numResponses = Math.floor(Math.random() * 2) + 3;

    for (let i = 0; i < numResponses; i++) {
      await new Promise(resolve => setTimeout(resolve, i === 0 ? 400 : 1000));
      await generateNewMessage(userQuestion);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingLegend]);

  return (
    <div className="w-full flex flex-col gap-4 md:grid md:grid-cols-[1fr_220px]">
      {/* Main Debate Area */}
      <div className="relative flex-1">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold uppercase tracking-wider bg-foreground text-background px-2 py-1">
              LIVE DEBATE
            </div>
            {isLoadingNews && (
              <span className="text-xs text-muted-foreground animate-pulse">Loading news...</span>
            )}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {currentTopic.source && <span className="mr-2">{currentTopic.source}</span>}
            {currentTopic.date}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[500px] overflow-y-auto p-6 space-y-6 border-2 border-foreground bg-background/80 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] scroll-smooth rounded-sm"
        >
          {/* Show topic headline at top */}
          <div className="text-center pb-4 border-b border-foreground/20 mb-4">
            <h3 className="font-bold text-lg">{currentTopic.fullHeadline || currentTopic.topic}</h3>
            {currentTopic.summary && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{currentTopic.summary}</p>
            )}
          </div>

          {isGeneratingInitial && messages.length === 0 && (
            <div className="space-y-4 p-4 animate-pulse">
              {/* Skeleton Messages */}
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-8 h-8 rounded-full bg-foreground/20 flex-shrink-0" />
                  <div className={`flex-1 space-y-2 py-3 px-4 rounded-xl ${i % 2 === 0 ? 'bg-secondary/30 rounded-tl-none' : 'bg-primary/10 rounded-tr-none'}`}>
                    <div className="h-4 bg-foreground/10 rounded w-3/4" />
                    <div className="h-4 bg-foreground/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

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
                  confidence={msg.confidence}
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
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: legends[typingLegend].color }}>
                <img src={legends[typingLegend].avatar} alt="" className="w-full h-full object-cover" />
              </div>
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

      {/* Topic Sidebar - Real News */}
      <div className="hidden md:flex flex-col border-2 border-foreground bg-muted/10 h-[500px] mt-8">
        <div className="bg-foreground text-background p-2 font-bold text-center text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live News
        </div>
        <div className="flex-1 overflow-y-auto">
          {newsTopics.map((topic, idx) => (
            <button
              key={topic.id}
              onClick={() => setCurrentTopicIndex(idx)}
              className={`w-full text-left p-3 border-b border-foreground/20 hover:bg-foreground/5 transition-colors group ${idx === currentTopicIndex ? 'bg-foreground/10 border-l-4 border-l-foreground' : ''
                }`}
            >
              <div className="text-[10px] font-mono text-muted-foreground mb-1 group-hover:text-foreground flex justify-between">
                <span>{topic.date}</span>
                {topic.source && <span className="opacity-50">{topic.source}</span>}
              </div>
              <div className="text-xs font-bold leading-tight">
                {topic.topic}
              </div>
            </button>
          ))}
        </div>
        {lastUpdated && (
          <div className="p-2 text-center text-[10px] text-muted-foreground border-t border-foreground/20">
            Updated: {lastUpdated}
          </div>
        )}
      </div>

      {/* Export active legend for parent component */}
      <input type="hidden" id="active-legend" value={activeLegend || ''} />
    </div>
  );
}
