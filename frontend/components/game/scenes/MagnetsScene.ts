import { Scene } from 'phaser';

export class MagnetsScene extends Scene {
    private magnets: Magnet[] = [];
    private graphics!: Phaser.GameObjects.Graphics;
    private showOverlay: boolean = false;

    constructor() {
        super('MagnetsScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#e0e0e0');

        this.add.text(20, 20, 'Magnets Lab: Drag magnets to interact', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000'
        });

        // Initialize graphics
        this.graphics = this.add.graphics();

        // Check initial state from registry
        this.showOverlay = this.registry.get('showOverlay') || false;

        // Listen for overlay toggle
        this.game.events.on('toggle-overlay', (show: boolean) => {
            this.showOverlay = show;
        });

        // Create magnets
        const mag1 = new Magnet(this, 300, 300);
        const mag2 = new Magnet(this, 500, 300);

        this.magnets.push(mag1);
        this.magnets.push(mag2);

        this.input.setDraggable(this.magnets);

        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Magnet) => {
            // Stop physics when dragging
            if (gameObject.body) {
                (gameObject.body as Phaser.Physics.Arcade.Body).setVelocity(0);
            }
        });

        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Magnet, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Magnet) => {
             if (gameObject.body) {
                // Optional: keep some momentum or stop
                (gameObject.body as Phaser.Physics.Arcade.Body).setVelocity(0);
            }
        });

        this.createCompleteButton();
    }

    private createCompleteButton() {
        const button = this.add.text(700, 550, 'Complete', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#22c55e',
            padding: { x: 10, y: 5 }
        })
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0); // Fix to camera

        button.on('pointerdown', () => {
            const onGameComplete = this.registry.get('onGameComplete');
            if (onGameComplete) {
                onGameComplete();
            } else {
                console.warn('onGameComplete callback not found in registry');
            }
        });

        button.on('pointerover', () => button.setStyle({ backgroundColor: '#16a34a' }));
        button.on('pointerout', () => button.setStyle({ backgroundColor: '#22c55e' }));
    }

    update() {
        if (this.magnets.length < 2) return;

        // Simple interaction between the first two magnets
        const mag1 = this.magnets[0];
        const mag2 = this.magnets[1];
        
        this.applyMagneticForces(mag1, mag2);

        this.graphics.clear();
        if (this.showOverlay) {
            this.drawForceVectors(mag1, mag2);
        }
    }

    private drawForceVectors(m1: Magnet, m2: Magnet) {
        const poles1 = m1.getPoles();
        const poles2 = m2.getPoles();

        // Pairs to visualize
        const pairs = [
            { p1: poles1.N, p2: poles2.N, color: 0xff0000 }, // Repel (Red)
            { p1: poles1.S, p2: poles2.S, color: 0xff0000 }, // Repel (Red)
            { p1: poles1.N, p2: poles2.S, color: 0x00ff00 }, // Attract (Green)
            { p1: poles1.S, p2: poles2.N, color: 0x00ff00 }  // Attract (Green)
        ];

        pairs.forEach(pair => {
            this.graphics.lineStyle(2, pair.color, 0.6);
            this.graphics.lineBetween(pair.p1.x, pair.p1.y, pair.p2.x, pair.p2.y);
        });
    }

    private applyMagneticForces(m1: Magnet, m2: Magnet) {
        const body1 = m1.body as Phaser.Physics.Arcade.Body;
        const body2 = m2.body as Phaser.Physics.Arcade.Body;

        if (!body1 || !body2) return;

        let fx1 = 0, fy1 = 0;
        let fx2 = 0, fy2 = 0;

        const poles1 = m1.getPoles();
        const poles2 = m2.getPoles();
        
        const forceStrength = 50000;
        const maxDist = 300;

        const pairs = [
            { p1: poles1.N, p2: poles2.N, type: 'repel' },
            { p1: poles1.S, p2: poles2.S, type: 'repel' },
            { p1: poles1.N, p2: poles2.S, type: 'attract' },
            { p1: poles1.S, p2: poles2.N, type: 'attract' }
        ];

        pairs.forEach(pair => {
            const dx = pair.p1.x - pair.p2.x;
            const dy = pair.p1.y - pair.p2.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            if (dist < maxDist && dist > 10) {
                const forceMag = forceStrength / distSq;
                
                let dirX = dx / dist;
                let dirY = dy / dist;

                if (pair.type === 'attract') {
                    dirX = -dirX;
                    dirY = -dirY;
                }

                fx1 += dirX * forceMag;
                fy1 += dirY * forceMag;

                fx2 -= dirX * forceMag;
                fy2 -= dirY * forceMag;
            }
        });

        body1.setAcceleration(fx1, fy1);
        body2.setAcceleration(fx2, fy2);
        
        body1.setDrag(100);
        body2.setDrag(100);
    }
}

class Magnet extends Phaser.GameObjects.Container {
    private northPole: Phaser.GameObjects.Rectangle;
    private southPole: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        const width = 100;
        const height = 30;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(width, height);
        body.setOffset(-width / 2, -height / 2);
        body.setCollideWorldBounds(true);
        body.setBounce(0.2);

        this.northPole = scene.add.rectangle(-width/4, 0, width/2, height, 0xff0000);
        this.southPole = scene.add.rectangle(width/4, 0, width/2, height, 0x0000ff);
        
        const nLabel = scene.add.text(-width/4, 0, 'N', { color: 'white', fontSize: '16px' }).setOrigin(0.5);
        const sLabel = scene.add.text(width/4, 0, 'S', { color: 'white', fontSize: '16px' }).setOrigin(0.5);

        this.add([this.northPole, this.southPole, nLabel, sLabel]);
        
        this.setSize(width, height);
        this.setInteractive();
    }

    getPoles() {
        const nLocal = { x: -25, y: 0 };
        const sLocal = { x: 25, y: 0 };
        
        return {
            N: { x: this.x + nLocal.x, y: this.y + nLocal.y },
            S: { x: this.x + sLocal.x, y: this.y + sLocal.y }
        };
    }
}
