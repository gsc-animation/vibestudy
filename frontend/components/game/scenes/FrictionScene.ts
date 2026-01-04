import { Scene } from 'phaser';

interface SurfaceConfig {
    name: string;
    friction: number;
    color: number;
    startX: number;
    endX: number;
}

export class FrictionScene extends Scene {
    private car!: Phaser.Physics.Matter.Image;
    private arrowGraphics!: Phaser.GameObjects.Graphics;
    private surfaceText!: Phaser.GameObjects.Text;
    private infoText!: Phaser.GameObjects.Text;
    
    private isDragging: boolean = false;
    private dragStartPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    
    private currentSurface: SurfaceConfig | null = null;
    private isMoving: boolean = false;
    
    // Constants
    private readonly CAR_START_X = 100;
    private readonly CAR_START_Y = 450;
    private readonly FORCE_MULTIPLIER = 0.0002; // Tweaked for Matter.js force scale
    private readonly STOP_VELOCITY_THRESHOLD = 0.1;

    private readonly surfaces: SurfaceConfig[] = [
        { name: 'Ice', friction: 0.02, color: 0xADD8E6, startX: 0, endX: 300 },
        { name: 'Wood', friction: 0.30, color: 0xDEB887, startX: 300, endX: 600 },
        { name: 'Rubber', friction: 0.80, color: 0x505050, startX: 600, endX: 800 }
    ];

    constructor() {
        super('FrictionScene');
    }

    create() {
        // Note: This scene requires the Matter.js physics engine to be enabled in the game config
        this.cameras.main.setBackgroundColor('#f0f0f0');

        // Setup world bounds
        this.matter.world.setBounds(0, 0, 800, 600);
        
        // Draw Surfaces
        this.createSurfaces();
        
        // UI Text
        this.add.text(20, 20, 'Friction Lab: Drag the car to slingshot it', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000'
        });

        this.surfaceText = this.add.text(20, 50, 'Surface: None', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#000000'
        });
        
        this.infoText = this.add.text(20, 80, 'Velocity: 0', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#666666'
        });

        // Initialize Graphics for Arrow
        this.arrowGraphics = this.add.graphics();

        // Create Car
        this.createCar();

        // Inputs
        this.setupInput();

        // Check initial state
        this.updateSurfaceInfo();

        // Cleanup
        this.events.on('shutdown', this.shutdown, this);
    }

    private createSurfaces() {
        this.surfaces.forEach(surface => {
            const width = surface.endX - surface.startX;
            const height = 600;
            const x = surface.startX + width / 2;
            const y = height / 2;

            // Visual representation
            this.add.rectangle(x, y, width, height, surface.color).setDepth(0);
            
            // Label
            this.add.text(x, 550, `${surface.name} (μ=${surface.friction})`, {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        });
    }

    private createCar() {
        // Create a simple car shape texture if it doesn't exist
        if (!this.textures.exists('car')) {
            const graphics = this.make.graphics({ x: 0, y: 0 });
            graphics.fillStyle(0xff0000);
            graphics.fillRect(0, 0, 60, 30);
            graphics.lineStyle(2, 0x000000);
            graphics.strokeRect(0, 0, 60, 30);
            graphics.generateTexture('car', 60, 30);
        }

        // Add car with Matter physics
        this.car = this.matter.add.image(this.CAR_START_X, this.CAR_START_Y, 'car');
        
        // Configure physics body
        this.car.setFrictionAir(0.001); // Low air resistance
        this.car.setBounce(0.2);
        this.car.setDensity(0.01);
        
        // Ensure it doesn't rotate too crazily
        this.car.setFixedRotation(); 
        
        this.car.setInteractive();
    }

    private setupInput() {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]) => {
            if (gameObjects.includes(this.car) && !this.isMoving) {
                this.isDragging = true;
                this.dragStartPos.set(pointer.x, pointer.y);
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging) {
                this.drawForceArrow(pointer);
            }
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging) {
                this.launchCar(pointer);
                this.isDragging = false;
                this.arrowGraphics.clear();
            }
        });
    }

    private drawForceArrow(pointer: Phaser.Input.Pointer) {
        this.arrowGraphics.clear();
        
        // Vector from car to pointer (drag direction)
        // Force will be applied in opposite direction (slingshot)
        const startX = this.car.x;
        const startY = this.car.y;
        const endX = pointer.x;
        const endY = pointer.y;

        // Draw drag line
        this.arrowGraphics.lineStyle(2, 0x666666, 0.5);
        this.arrowGraphics.lineBetween(startX, startY, endX, endY);

        // Draw launch vector (opposite)
        const dx = startX - endX;
        const dy = startY - endY;
        
        this.arrowGraphics.lineStyle(4, 0xff0000, 1);
        this.arrowGraphics.lineBetween(startX, startY, startX + dx, startY + dy);
        
        // Arrow head
        const angle = Math.atan2(dy, dx);
        const headLen = 15;
        this.arrowGraphics.lineTo(
            (startX + dx) - headLen * Math.cos(angle - Math.PI / 6),
            (startY + dy) - headLen * Math.sin(angle - Math.PI / 6)
        );
        this.arrowGraphics.moveTo(startX + dx, startY + dy);
        this.arrowGraphics.lineTo(
            (startX + dx) - headLen * Math.cos(angle + Math.PI / 6),
            (startY + dy) - headLen * Math.sin(angle + Math.PI / 6)
        );
        this.arrowGraphics.strokePath();
    }

    private launchCar(pointer: Phaser.Input.Pointer) {
        const dx = this.car.x - pointer.x;
        const dy = this.car.y - pointer.y;
        
        // Apply force
        const forceX = dx * this.FORCE_MULTIPLIER;
        const forceY = dy * this.FORCE_MULTIPLIER;
        
        this.car.applyForce(new Phaser.Math.Vector2(forceX, forceY));
        
        this.isMoving = true;
        this.game.events.emit('friction-start');
    }

    update() {
        if (!this.car || !this.car.body) return;

        this.updateSurfaceInfo();
        
        const velocityVector = this.car.getVelocity();
        const velocity = Math.sqrt(Math.pow(velocityVector.x, 2) + Math.pow(velocityVector.y, 2));
        this.infoText.setText(`Velocity: ${velocity.toFixed(2)}`);

        // Check stop condition
        if (this.isMoving && velocity < this.STOP_VELOCITY_THRESHOLD) {
            // Verify it stays stopped for a moment or just threshold? 
            // For simplicity, if it drops below threshold, we count it as stopped.
            this.isMoving = false;
            
            // Stop completely to avoid micro-sliding
            this.car.setVelocity(0, 0);
            
            this.game.events.emit('friction-stop', {
                distance: this.car.x - this.CAR_START_X,
                surface: this.currentSurface?.name
            });
        }
    }

    private updateSurfaceInfo() {
        const x = this.car.x;
        
        // Find current surface
        const newSurface = this.surfaces.find(s => x >= s.startX && x < s.endX) || null;
        
        if (newSurface && newSurface !== this.currentSurface) {
            this.currentSurface = newSurface;
            
            // Update physics friction
            this.car.setFriction(newSurface.friction);
            
            // Update UI
            this.surfaceText.setText(`Surface: ${newSurface.name} (μ=${newSurface.friction})`);
            
            // Emit event
            this.game.events.emit('friction-surface-change', {
                surface: newSurface.name,
                coefficient: newSurface.friction
            });
        }
    }

    shutdown() {
        this.input.off('pointerdown');
        this.input.off('pointermove');
        this.input.off('pointerup');
    }
}