'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    legend?: string;
    timestamp: number;
}

interface ConversationMemory {
    topic: string;
    messages: ConversationMessage[];
    lastUpdated: number;
}

interface MemoryContextType {
    conversations: Record<string, ConversationMemory>;
    addMessage: (topic: string, message: ConversationMessage) => void;
    getConversation: (topic: string) => ConversationMemory | null;
    clearConversation: (topic: string) => void;
    getRecentContext: (topic: string, maxMessages?: number) => ConversationMessage[];
}

const MemoryContext = createContext<MemoryContextType | null>(null);

const STORAGE_KEY = 'legendary_investor_memory';
const MAX_MESSAGES_PER_TOPIC = 20;

export function MemoryProvider({ children }: { children: ReactNode }) {
    const [conversations, setConversations] = useState<Record<string, ConversationMemory>>({});

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setConversations(parsed);
            }
        } catch (e) {
            console.error('Failed to load conversation memory:', e);
        }
    }, []);

    // Save to localStorage when conversations change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
        } catch (e) {
            console.error('Failed to save conversation memory:', e);
        }
    }, [conversations]);

    const addMessage = (topic: string, message: ConversationMessage) => {
        setConversations(prev => {
            const existing = prev[topic] || { topic, messages: [], lastUpdated: Date.now() };
            const newMessages = [...existing.messages, message].slice(-MAX_MESSAGES_PER_TOPIC);

            return {
                ...prev,
                [topic]: {
                    topic,
                    messages: newMessages,
                    lastUpdated: Date.now()
                }
            };
        });
    };

    const getConversation = (topic: string): ConversationMemory | null => {
        return conversations[topic] || null;
    };

    const clearConversation = (topic: string) => {
        setConversations(prev => {
            const { [topic]: _, ...rest } = prev;
            return rest;
        });
    };

    const getRecentContext = (topic: string, maxMessages: number = 6): ConversationMessage[] => {
        const conversation = conversations[topic];
        if (!conversation) return [];
        return conversation.messages.slice(-maxMessages);
    };

    return (
        <MemoryContext.Provider value={{
            conversations,
            addMessage,
            getConversation,
            clearConversation,
            getRecentContext
        }}>
            {children}
        </MemoryContext.Provider>
    );
}

export function useMemory() {
    const context = useContext(MemoryContext);
    if (!context) {
        throw new Error('useMemory must be used within a MemoryProvider');
    }
    return context;
}

// Helper to format messages for API calls
export function formatMessagesForAPI(messages: ConversationMessage[]) {
    return messages.map(m => ({
        role: m.role,
        content: m.content
    }));
}
