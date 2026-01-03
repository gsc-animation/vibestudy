import { Scene } from 'phaser';

export class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        console.log('BootScene preloading...');
        // Placeholder for asset loading
    }

    create() {
        console.log('BootScene created');
        
        // Set background color
        this.cameras.main.setBackgroundColor('#2d2d2d');

        // Add text to verify rendering
        const text = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'VibeStudy Lab',
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#ffffff'
            }
        );
        text.setOrigin(0.5);
    }
}