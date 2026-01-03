'use client';

import React, { useEffect, useRef } from 'react';
import { BootScene } from './scenes/BootScene';
import { MagnetsScene } from './scenes/MagnetsScene';
import { OverlayScene } from './scenes/OverlayScene';
import * as Phaser from 'phaser';

interface PhaserGameProps {
    config?: Phaser.Types.Core.GameConfig;
    onGameComplete?: () => void;
    showOverlay?: boolean;
    interactionEnabled?: boolean;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ config, onGameComplete, showOverlay = false, interactionEnabled = false }) => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update registry when onGameComplete changes
    useEffect(() => {
        if (gameRef.current && onGameComplete) {
            gameRef.current.registry.set('onGameComplete', onGameComplete);
        }
    }, [onGameComplete]);

    // Emit overlay event when showOverlay changes
    useEffect(() => {
        if (gameRef.current) {
             gameRef.current.events.emit('toggle-overlay', showOverlay);
             gameRef.current.registry.set('showOverlay', showOverlay);
        }
    }, [showOverlay]);

    // Emit interaction toggle event when interactionEnabled changes
    useEffect(() => {
        if (gameRef.current) {
            gameRef.current.events.emit('toggle-interaction', interactionEnabled);
            gameRef.current.registry.set('interactionEnabled', interactionEnabled);
        }
    }, [interactionEnabled]);

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
            scene: [MagnetsScene, BootScene, OverlayScene],
            ...config
        };

        gameRef.current = new Phaser.Game(defaultConfig);

        // Initial set of registry
        if (onGameComplete) {
            gameRef.current.registry.set('onGameComplete', onGameComplete);
        }
        
        gameRef.current.registry.set('showOverlay', showOverlay);
        gameRef.current.registry.set('interactionEnabled', interactionEnabled);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config]);

    return (
        <div 
            ref={containerRef} 
            id="phaser-container" 
            style={{ width: '100%', height: '100%' }}
        />
    );
};

// Memoize to prevent unnecessary re-renders that could affect canvas
export default React.memo(PhaserGame);
