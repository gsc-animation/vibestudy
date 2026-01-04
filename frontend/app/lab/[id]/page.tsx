'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import LabLayout from '@/components/lab/LabLayout';
import LabNotebook from '@/components/lab/LabNotebook';
import { LabProvider, useLab } from '@/contexts/LabContext';
import { ExperimentPhase } from '@/lib/experiments';
import type * as Phaser from 'phaser';

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
    params: Promise<{
        id: string;
    }>;
}

function LabPageContent({ params }: LabPageProps) {
    // Unwrap params using React.use()
    const unwrappedParams = React.use(params);
    
    const { data: session } = useSession();
    const { showOverlay } = useLab();
    const [experimentPhase, setExperimentPhase] = useState<ExperimentPhase>('prediction');
    const [gameConfig, setGameConfig] = useState<Phaser.Types.Core.GameConfig | null>(null);

    // In a real app, we would fetch lab details based on params.id
    const labTitle = `Experiment Lab ${unwrappedParams.id}`;
    const userId = session?.user?.email || 'demo-user';
    const questId = unwrappedParams.id;

    // Determine lab type based on quest/experiment ID
    const getLabType = (id: string): 'magnets' | 'friction' => {
        if (id.includes('friction') || id === 'experiment-2' || id === 'car-on-surfaces') {
            return 'friction';
        }
        return 'magnets';
    };

    const labType = getLabType(questId);

    // Handle phase changes from the LabNotebook
    const handlePhaseChange = useCallback((phase: ExperimentPhase) => {
        setExperimentPhase(phase);
    }, []);

    // Handle experiment completion
    const handleExperimentComplete = useCallback((data: { prediction: string; observation: string }) => {
        console.log('Experiment completed:', data);
        // Could show confetti, update achievements, etc.
    }, []);

    // Initialize game config on client side only
    React.useEffect(() => {
        import('phaser').then((PhaserModule) => {
            setGameConfig({
                scale: {
                    mode: PhaserModule.Scale.RESIZE, // Important for filling the flex container
                    width: '100%',
                    height: '100%',
                    autoCenter: PhaserModule.Scale.NO_CENTER
                },
                backgroundColor: '#0f172a' // Match slate-900 roughly
            });
        });
    }, []);

    return (
        <LabLayout
            title={labTitle}
            notebook={
                <LabNotebook
                    userId={userId}
                    questId={questId}
                    questType={labType}
                    onPhaseChange={handlePhaseChange}
                    onExperimentComplete={handleExperimentComplete}
                />
            }
        >
            {gameConfig ? (
                <PhaserGame
                    config={gameConfig}
                    showOverlay={showOverlay}
                    interactionEnabled={experimentPhase === 'experiment'}
                    labType={labType}
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-400">
                    Initializing Physics Engine...
                </div>
            )}
            
            {/* Instruction overlay based on experiment phase */}
            {experimentPhase === 'prediction' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none z-10">
                    <div className="bg-slate-800 text-white px-6 py-4 rounded-lg shadow-xl max-w-md text-center">
                        <p className="text-lg font-medium">
                            📝 First, make your prediction in the Lab Notebook!
                        </p>
                        <p className="text-sm text-slate-300 mt-2">
                            Use the sentence builder on the right to complete your hypothesis.
                        </p>
                    </div>
                </div>
            )}
            
            {experimentPhase === 'experiment' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
                        <p className="text-sm font-medium">
                            {labType === 'friction'
                                ? '🧪 Release the car to test your prediction!'
                                : '🧪 Drag the magnets to test your prediction!'}
                        </p>
                    </div>
                </div>
            )}
        </LabLayout>
    );
}

export default function LabPage(props: LabPageProps) {
    return (
        <LabProvider>
            <LabPageContent {...props} />
        </LabProvider>
    );
}
