import Phaser from 'phaser';

export class FrictionOverlayScene extends Phaser.Scene {
    private graphics!: Phaser.GameObjects.Graphics;
    private velocityText!: Phaser.GameObjects.Text;
    private distanceText!: Phaser.GameObjects.Text;
    private surfaceText!: Phaser.GameObjects.Text;
    private rulerContainer!: Phaser.GameObjects.Container;
    
    private isActive: boolean = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private frictionScene: any = null;
    
    // Constants matching FrictionScene for overlay consistency
    private readonly CAR_START_X = 100;
    private readonly PIXELS_PER_METER = 100;
    
    private readonly SURFACES = [
        { name: 'ICE', startX: 0, endX: 300 },
        { name: 'WOOD', startX: 300, endX: 600 },
        { name: 'RUBBER', startX: 600, endX: 800 }
    ];

    constructor() {
        super({ key: 'FrictionOverlayScene', active: true });
    }

    create() {
        this.graphics = this.add.graphics();
        this.rulerContainer = this.add.container(0, 0);

        // Initialize HUD (Heads Up Display)
        this.createHUD();
        this.createStaticVisuals();

        // Get reference to FrictionScene for direct data access
        this.frictionScene = this.scene.get('FrictionScene');

        // Event Listeners
        this.game.events.on('friction-surface-change', this.handleSurfaceChange, this);
        this.game.events.on('friction-stop', this.handleStop, this);
        this.game.events.on('friction-start', this.handleStart, this);
        this.game.events.on('toggle-overlay', this.handleToggle, this);
        
        // Initial State Check
        if (!this.isActive) {
            this.handleToggle(false);
        }
    }

    private createHUD() {
        const style = { 
            fontFamily: 'Arial', 
            fontSize: '16px', 
            color: '#000000', 
            stroke: '#ffffff', 
            strokeThickness: 3 
        };
        
        // Positioned at top-right to avoid overlapping with FrictionScene's top-left UI
        const x = 600;
        this.velocityText = this.add.text(x, 20, 'Velocity: 0.00 m/s', style);
        this.distanceText = this.add.text(x, 45, 'Distance: 0.00 m', style);
        this.surfaceText = this.add.text(x, 70, 'Surface: None', style);
    }

    private createStaticVisuals() {
        // Surface Labels
        this.SURFACES.forEach(surface => {
            const centerX = surface.startX + (surface.endX - surface.startX) / 2;
            this.add.text(centerX, 100, surface.name, {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#000000',
                fontStyle: 'bold'
            })
            .setAlpha(0.3)
            .setOrigin(0.5);
        });

        // Ruler at the bottom
        const y = 580;
        const width = 800;
        
        // Main line
        this.rulerContainer.add(this.add.line(0, 0, 0, y, width, y, 0x000000).setOrigin(0));
        
        // Ticks and numbers
        for (let x = 0; x <= width; x += 50) {
            const isMajor = x % 100 === 0;
            const height = isMajor ? 10 : 5;
            
            this.rulerContainer.add(
                this.add.line(0, 0, x, y, x, y - height, 0x000000).setOrigin(0)
            );
            
            if (isMajor) {
                // Adjust value relative to car start if needed, 
                // but showing absolute scale is usually clearer for a ruler.
                // Here we show relative distance markers from 0.
                this.rulerContainer.add(this.add.text(x, y - 25, `${x / this.PIXELS_PER_METER}m`, {
                    fontFamily: 'Arial',
                    fontSize: '10px',
                    color: '#000000'
                }).setOrigin(0.5));
            }
        }
    }

    update() {
        if (!this.isActive || !this.frictionScene) return;

        // Access the car from the FrictionScene
        // Note: 'car' is private in FrictionScene but accessible via JS runtime
        const car = this.frictionScene.car;
        
        if (!car || !car.body) return;

        // Get velocity
        // Depending on Phaser Matter version, use getVelocity or body.velocity
        let vx = 0;
        let vy = 0;
        
        if (typeof car.getVelocity === 'function') {
            const v = car.getVelocity();
            vx = v.x;
            vy = v.y;
        } else {
            vx = car.body.velocity.x;
            vy = car.body.velocity.y;
        }

        const speed = Math.sqrt(vx * vx + vy * vy);
        const distancePx = Math.max(0, car.x - this.CAR_START_X);
        const distanceM = distancePx / this.PIXELS_PER_METER;

        // Update Text
        this.velocityText.setText(`Velocity: ${speed.toFixed(2)} m/s`);
        this.distanceText.setText(`Distance: ${distanceM.toFixed(2)} m`);

        // Clear previous frame's dynamic graphics
        this.graphics.clear();

        // Draw Force Vectors if moving significantly
        if (speed > 0.05) {
            this.drawVectors(car.x, car.y, vx, vy);
        }
    }

    private drawVectors(x: number, y: number, vx: number, vy: number) {
        // 1. Applied Force / Motion Arrow (Green)
        // Represents the current motion/momentum direction
        const motionScale = 20;
        const greenEndX = x + vx * motionScale;
        const greenEndY = y + vy * motionScale;
        
        this.drawArrow(x, y, greenEndX, greenEndY, 0x00ff00, 2);

        // 2. Friction Force Arrow (Red)
        // Opposes motion. Magnitude depends on friction coefficient.
        // We retrieve the current friction from the physics body
        const frictionCoeff = this.frictionScene.car.body.friction;
        
        // Scale friction vector for visibility (e.g., 1.0 friction = 100px)
        const frictionScale = 150; 
        const frictionLen = (frictionCoeff || 0) * frictionScale;
        
        // Direction is opposite to velocity
        const angle = Math.atan2(vy, vx);
        const redEndX = x - Math.cos(angle) * frictionLen;
        const redEndY = y - Math.sin(angle) * frictionLen;

        this.drawArrow(x, y, redEndX, redEndY, 0xff0000, 3);
    }

    private drawArrow(x1: number, y1: number, x2: number, y2: number, color: number, width: number) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const len = Phaser.Math.Distance.Between(x1, y1, x2, y2);
        
        if (len < 5) return;

        // Line
        this.graphics.lineStyle(width, color, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.strokePath();

        // Arrow head
        const headLen = 12;
        this.graphics.fillStyle(color, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(x2, y2);
        this.graphics.lineTo(
            x2 - headLen * Math.cos(angle - Math.PI / 6),
            y2 - headLen * Math.sin(angle - Math.PI / 6)
        );
        this.graphics.lineTo(
            x2 - headLen * Math.cos(angle + Math.PI / 6),
            y2 - headLen * Math.sin(angle + Math.PI / 6)
        );
        this.graphics.closePath();
        this.graphics.fillPath();
    }

    private handleSurfaceChange(data: { surface: string, coefficient: number }) {
        // Color code based on friction
        let color = '#00aa00'; // Green (Low)
        if (data.coefficient >= 0.3) color = '#aaaa00'; // Yellow/Orange (Medium)
        if (data.coefficient >= 0.8) color = '#aa0000'; // Red (High)

        this.surfaceText.setText(`Surface: ${data.surface} (μ=${data.coefficient})`);
        this.surfaceText.setColor(color);
    }

    private handleStop() {
        this.velocityText.setText('Velocity: 0.00 m/s');
    }
    
    private handleStart() {
        // Reset or prepare visuals if needed
    }

    private handleToggle(active: boolean) {
        this.isActive = active;
        
        // Toggle visibility of all children
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.children.list.forEach((child: any) => {
            child.setActive(active);
            if (child.setVisible) {
                child.setVisible(active);
            }
        });

        if (!active) {
            this.graphics.clear();
        }
    }
}