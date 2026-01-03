'use client';

import React, { useEffect, useRef } from 'react';
import { BootScene } from './scenes/BootScene';
import { MagnetsScene } from './scenes/MagnetsScene';
import * as Phaser from 'phaser';

interface PhaserGameProps {
    config?: Phaser.Types.Core.GameConfig;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ config }) => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gameRef.current || !containerRef.current) return;

        const defaultConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: containerRef.current,
            backgroundColor: '#2d2d2d',
            scale: {
                width: 800,
                height: 600,
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    // debug: true
                }
            },
            scene: [MagnetsScene, BootScene],
            ...config
        };

        gameRef.current = new Phaser.Game(defaultConfig);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [config]);

    return (
        <div 
            ref={containerRef} 
            id="phaser-container" 
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default PhaserGame;