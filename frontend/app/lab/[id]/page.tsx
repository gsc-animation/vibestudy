'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import LabLayout from '@/components/lab/LabLayout';
import LabNotebook from '@/components/lab/LabNotebook';

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
    // In a real app, we would fetch lab details based on params.id
    const labTitle = `Experiment Lab ${params.id}`;

    // Custom configuration for the lab instance
    const gameConfig = {
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
            <PhaserGame config={gameConfig} />
        </LabLayout>
    );
}