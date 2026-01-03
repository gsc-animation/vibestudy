'use client';

import React, { useEffect, useRef } from 'react';
import { BootScene } from './scenes/BootScene';
import { MagnetsScene } from './scenes/MagnetsScene';
import * as Phaser from 'phaser';

interface PhaserGameProps {
    config?: Phaser.Types.Core.GameConfig;
    onGameComplete?: () => void;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ config, onGameComplete }) => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update registry when onGameComplete changes
    useEffect(() => {
        if (gameRef.current && onGameComplete) {
            gameRef.current.registry.set('onGameComplete', onGameComplete);
        }
    }, [onGameComplete]);

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

        // Initial set of registry
        if (onGameComplete) {
            gameRef.current.registry.set('onGameComplete', onGameComplete);
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [config]); // Removed onGameComplete from dependency array to prevent game re-creation

    return (
        <div 
            ref={containerRef} 
            id="phaser-container" 
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default PhaserGame;
