'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Loader2, Check } from 'lucide-react';

interface PortfolioVoiceInputProps {
    onHoldingsParsed: (holdings: { symbol: string; shares: number }[]) => void;
}

export function PortfolioVoiceInput({ onHoldingsParsed }: PortfolioVoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ((window as any).webkitSpeechRecognition) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setTranscript('');
            };

            recognition.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Voice recognition not supported in this browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            processTranscript(transcript);
        } else {
            recognitionRef.current.start();
        }
    };

    const processTranscript = async (text: string) => {
        if (!text.trim()) return;

        setIsProcessing(true);
        try {
            const response = await fetch('/api/portfolio/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: text }),
            });

            const data = await response.json();

            if (data.holdings && Array.isArray(data.holdings) && data.holdings.length > 0) {
                onHoldingsParsed(data.holdings);
                // Show success briefly
                setTranscript(`✓ Found ${data.holdings.length} stock(s): ${data.holdings.map((h: any) => h.symbol).join(', ')}`);
                setTimeout(() => setTranscript(''), 3000);
            } else {
                // Show the raw transcript so user can manually edit
                setTranscript(`No stocks found. You said: "${text}"`);
                setTimeout(() => setTranscript(''), 5000);
            }
        } catch (error) {
            console.error('Failed to process voice input', error);
            setTranscript('Error processing. Try again.');
            setTimeout(() => setTranscript(''), 3000);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="mb-6 border-2 border-foreground/20 rounded-lg p-4 bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleListening}
                    disabled={isProcessing}
                    aria-label={isListening ? "Stop Listening" : "Start Voice Input"}
                    className={`
            relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-foreground transition-all
            ${isListening ? 'bg-red-500 text-white animate-pulse border-red-600' : 'bg-background hover:bg-foreground hover:text-background'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
                    )}
                </button>

                <div className="flex-1">
                    {isListening ? (
                        <div>
                            <p className="text-xs font-bold uppercase text-red-500 mb-1">Listening...</p>
                            <p className="text-sm font-mono">{transcript || "Start speaking..."}</p>
                        </div>
                    ) : isProcessing ? (
                        <div>
                            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">AI Processing...</p>
                            <p className="text-sm text-muted-foreground italic">Converting speech to portfolio data...</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm font-bold uppercase">Voice Input</p>
                            <p className="text-xs text-muted-foreground">Tap mic and say "I have 50 shares of Nvidia..."</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
