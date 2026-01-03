import { Scene } from 'phaser';

export class MagnetsScene extends Scene {
    private magnets: Magnet[] = [];

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
    }

    update() {
        if (this.magnets.length < 2) return;

        // Simple interaction between the first two magnets
        const mag1 = this.magnets[0];
        const mag2 = this.magnets[1];

        // If dragging, maybe skip physics or dampen it
        // For MVP, apply forces continuously
        
        this.applyMagneticForces(mag1, mag2);
    }

    private applyMagneticForces(m1: Magnet, m2: Magnet) {
        const body1 = m1.body as Phaser.Physics.Arcade.Body;
        const body2 = m2.body as Phaser.Physics.Arcade.Body;

        if (!body1 || !body2) return;

        // Reset forces (using acceleration as proxy for force)
        // We accumulate forces then apply to acceleration
        let fx1 = 0, fy1 = 0;
        let fx2 = 0, fy2 = 0;

        // Get poles world positions
        const poles1 = m1.getPoles();
        const poles2 = m2.getPoles();

        // Calculate forces between all pole pairs
        // Poles: N (North), S (South)
        // N-N: Repel
        // S-S: Repel
        // N-S: Attract
        
        const forceStrength = 50000; // Tuning parameter
        const maxDist = 300; // Interaction radius

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

            if (dist < maxDist && dist > 10) { // Avoid singularity
                const forceMag = forceStrength / distSq;
                
                // Direction for p1:
                // If repel: push away from p2 (direction p2 -> p1) -> vector (dx, dy)
                // If attract: pull towards p2 (direction p1 -> p2) -> vector (-dx, -dy)
                
                let dirX = dx / dist;
                let dirY = dy / dist;

                if (pair.type === 'attract') {
                    dirX = -dirX;
                    dirY = -dirY;
                }

                // Apply to m1
                fx1 += dirX * forceMag;
                fy1 += dirY * forceMag;

                // Apply opposite to m2 (Newton's 3rd law)
                fx2 -= dirX * forceMag;
                fy2 -= dirY * forceMag;
            }
        });

        // Apply acceleration to bodies
        // Assuming drag coefficient is handled by Physics drag or manual damping
        body1.setAcceleration(fx1, fy1);
        body2.setAcceleration(fx2, fy2);
        
        // Add some drag to stabilize
        body1.setDrag(100);
        body2.setDrag(100);
    }
}

class Magnet extends Phaser.GameObjects.Container {
    private northPole: Phaser.GameObjects.Rectangle;
    private southPole: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        // Dimensions
        const width = 100;
        const height = 30;

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Setup Physics Body
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(width, height);
        body.setOffset(-width / 2, -height / 2); // Center body
        body.setCollideWorldBounds(true);
        body.setBounce(0.2);

        // Draw Magnets
        // North (Red) - Left side
        this.northPole = scene.add.rectangle(-width/4, 0, width/2, height, 0xff0000);
        // South (Blue) - Right side
        this.southPole = scene.add.rectangle(width/4, 0, width/2, height, 0x0000ff);
        
        // Label
        const nLabel = scene.add.text(-width/4, 0, 'N', { color: 'white', fontSize: '16px' }).setOrigin(0.5);
        const sLabel = scene.add.text(width/4, 0, 'S', { color: 'white', fontSize: '16px' }).setOrigin(0.5);

        this.add([this.northPole, this.southPole, nLabel, sLabel]);
        
        // Make interactive for dragging
        this.setSize(width, height);
        this.setInteractive();
    }

    getPoles() {
        // Simple calculation assuming no rotation for MVP, or applying rotation if we had it.
        // Even if Arcade physics doesn't rotate body, the container might have rotation property if we change it.
        // For now, assuming rotation = 0.
        
        // To support rotation in future:
        // const rad = this.rotation;
        // const cos = Math.cos(rad);
        // const sin = Math.sin(rad);
        // Transform local offsets to world
        
        // Local offsets
        const nLocal = { x: -25, y: 0 };
        const sLocal = { x: 25, y: 0 };
        
        return {
            N: { x: this.x + nLocal.x, y: this.y + nLocal.y },
            S: { x: this.x + sLocal.x, y: this.y + sLocal.y }
        };
    }
}