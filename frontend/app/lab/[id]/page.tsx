'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LabLayout from '@/components/lab/LabLayout';
import LabNotebook from '@/components/lab/LabNotebook';
import PredictionModal from '@/components/lab/PredictionModal';
import ReflectionModal from '@/components/lab/ReflectionModal';
import * as Phaser from 'phaser';

// Dynamically import PhaserGame to avoid SSR issues
const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full text-slate-400">
            Loading Lab Environment...
        </div>
    )
});

interface LabPageProps {
    params: {
        id: string;
    };
}

export default function LabPage({ params }: LabPageProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [gameState, setGameState] = useState<'PREDICT' | 'PLAY' | 'REFLECT'>('PREDICT');
    const [logId, setLogId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // In a real app, we would fetch lab details based on params.id
    const labTitle = `Experiment Lab ${params.id}`;
    const BACKEND_URL = 'http://localhost:3001'; // Adjust if backend runs on different port

    const handlePredictionSubmit = async (prediction: string) => {
        // Allow proceeding even if session is missing for development/demo, 
        // but ideally we require a user.
        const userId = session?.user?.email || 'anonymous_user';

        setIsLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/experiments/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    questId: params.id,
                    prediction
                })
            });

            if (!response.ok) {
                // If backend is not reachable or fails, we might want to let them play anyway for dev
                console.warn('Backend prediction failed, proceeding in offline mode');
                // throw new Error('Failed to submit prediction');
            } else {
                const data = await response.json();
                setLogId(data.logId);
            }
            
            setGameState('PLAY');
        } catch (error) {
            console.error('Error submitting prediction:', error);
            // Fallback: allow play even if backend fails
            setGameState('PLAY');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameComplete = () => {
        setGameState('REFLECT');
    };

    const handleReflectionSubmit = async (observation: string) => {
        setIsLoading(true);
        try {
            if (logId) {
                const response = await fetch(`${BACKEND_URL}/experiments/result`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        logId,
                        resultData: { success: true },
                        reflection: observation
                    })
                });
                
                if (!response.ok) {
                     console.warn('Backend reflection failed');
                }
            } else {
                console.log('No logId, skipping backend save for reflection');
            }
            
            // Success - maybe show confetti here in future
            router.push('/dashboard');
        } catch (error) {
             console.error('Error submitting reflection:', error);
             router.push('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    // Custom configuration for the lab instance
    const gameConfig: Phaser.Types.Core.GameConfig = {
        // We can pass specific scene or physics config here
        scale: {
            mode: Phaser.Scale.RESIZE, // Important for filling the flex container
            width: '100%',
            height: '100%',
            autoCenter: Phaser.Scale.NO_CENTER
        },
        backgroundColor: '#0f172a' // Match slate-900 roughly
    };

    return (
        <LabLayout 
            title={labTitle}
            notebook={<LabNotebook />}
        >
            <PhaserGame 
                config={gameConfig} 
                onGameComplete={handleGameComplete}
            />
            
            <PredictionModal 
                isOpen={gameState === 'PREDICT'} 
                onSubmit={handlePredictionSubmit}
                isLoading={isLoading}
            />
            
            <ReflectionModal 
                isOpen={gameState === 'REFLECT'}
                onSubmit={handleReflectionSubmit}
                isLoading={isLoading}
            />
        </LabLayout>
    );
}
