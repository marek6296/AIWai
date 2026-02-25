'use client';

import { useEffect, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Mic, MicOff, PhoneCall, Loader2 } from 'lucide-react';

const retellWebClient = new RetellWebClient();
const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID as string;

export default function RetellVoice() {
    const [isCalling, setIsCalling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'active'>('idle');

    useEffect(() => {
        // Setup Retell Events
        retellWebClient.on('call_started', () => {
            console.log('Voice call started');
            setCallStatus('active');
            setIsCalling(true);
            setIsLoading(false);
        });

        retellWebClient.on('call_ended', () => {
            console.log('Voice call ended');
            setCallStatus('idle');
            setIsCalling(false);
            setIsLoading(false);
        });

        retellWebClient.on('error', (error) => {
            console.error('Retell error:', error);
            retellWebClient.stopCall();
            setCallStatus('idle');
            setIsCalling(false);
            setIsLoading(false);
        });

        return () => {
            // cleanup on unmount
            retellWebClient.off('call_started');
            retellWebClient.off('call_ended');
            retellWebClient.off('error');
        };
    }, []);

    const toggleCall = async () => {
        if (isCalling) {
            retellWebClient.stopCall();
            setCallStatus('idle');
            setIsCalling(false);
        } else {
            setIsLoading(true);
            setCallStatus('calling');
            try {
                // Fetch access token from our Next.js backend
                const response = await fetch('/api/retell/create-web-call', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ agent_id: agentId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to get web call token');
                }

                const data = await response.json();

                // Start the call using Web SDK
                await retellWebClient.startCall({
                    accessToken: data.access_token,
                });
            } catch (err) {
                console.error('Call initialization failed', err);
                setIsLoading(false);
                setCallStatus('idle');
            }
        }
    };

    return (
        <button
            onClick={toggleCall}
            disabled={isLoading && !isCalling}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold tracking-wide uppercase transition-all shadow-xl shadow-brand-indigo/10 ${isCalling
                ? 'bg-red-500 text-white hover:bg-red-600 scale-[0.98]'
                : isLoading
                    ? 'bg-brand-sand/70 text-white cursor-wait'
                    : 'bg-gradient-to-r from-brand-sand to-neutral-900 text-white hover:shadow-2xl hover:shadow-brand-sand/20 hover:-translate-y-0.5'
                }`}
        >
            {isLoading ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    Connecting...
                </>
            ) : isCalling ? (
                <>
                    <PhoneCall size={18} className="animate-pulse" />
                    Zavesiť hovor
                </>
            ) : (
                <>
                    <Mic size={18} />
                    Zavolať AI Asistentovi
                </>
            )}
        </button>
    );
}
