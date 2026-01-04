# Task 7.1: FrictionScene.ts - Core Physics Implementation

## Status: Pending

## Goal
Create an interactive Phaser scene where students can push a car on different surfaces and observe how friction affects its motion.

## Requirements
- [ ] Car sprite with physics body (mass, velocity, acceleration)
- [ ] Three surface types: ice, wood, rubber with distinct visuals
- [ ] Push/slingshot mechanic for launching the car
- [ ] Realistic friction deceleration based on surface coefficient
- [ ] Event emission for overlay scene consumption
- [ ] Complete button for phase progression

## Physics Model

### Friction Coefficients
| Surface | Coefficient (μ) | Expected Behavior |
|---------|-----------------|-------------------|
| Ice     | 0.02            | Car slides very far |
| Wood    | 0.30            | Car slides moderately |
| Rubber  | 0.80            | Car stops quickly |

### Deceleration Formula
```
Friction Force: F = μ * m * g
Deceleration: a = -μ * g (where g ≈ 300 px/s² for game feel)
```

## Technical Implementation

### File: `frontend/components/game/scenes/FrictionScene.ts`

```typescript
import { Scene } from 'phaser';

type SurfaceType = 'ice' | 'wood' | 'rubber';

interface SurfaceConfig {
  friction: number;
  color: number;
  label: string;
}

export class FrictionScene extends Scene {
  private car!: Phaser.GameObjects.Sprite;
  private carBody!: Phaser.Physics.Arcade.Body;
  private currentSurface: SurfaceType = 'wood';
  private graphics!: Phaser.GameObjects.Graphics;
  private surfaceGraphics!: Phaser.GameObjects.Graphics;
  
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private pushForce: number = 0;
  
  private interactionEnabled: boolean = false;
  
  // Reusable car data object
  private carData = {
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    surface: 'wood' as SurfaceType,
    friction: 0.3
  };

  private readonly surfaces: Record<SurfaceType, SurfaceConfig> = {
    ice: { friction: 0.02, color: 0xadd8e6, label: '🧊 Ice' },
    wood: { friction: 0.30, color: 0xdeb887, label: '🪵 Wood' },
    rubber: { friction: 0.80, color: 0x333333, label: '🛞 Rubber' }
  };

  private readonly GRAVITY = 300; // Simplified gravity constant for game feel
  private readonly START_X = 100;
  private readonly GROUND_Y = 400;

  constructor() {
    super('FrictionScene');
  }

  create() {
    // Background
    this.cameras.main.setBackgroundColor('#e8e8e8');
    
    // Title
    this.add.text(20, 20, 'Friction Lab: Push the car on different surfaces', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#000000'
    });
    
    // Graphics layers
    this.surfaceGraphics = this.add.graphics();
    this.graphics = this.add.graphics();
    
    // Draw initial surface
    this.drawSurface();
    
    // Create car
    this.createCar();
    
    // Create surface selector buttons
    this.createSurfaceButtons();
    
    // Create complete button
    this.createCompleteButton();
    
    // Setup drag mechanics
    this.setupDragMechanics();
    
    // Listen for interaction toggle
    this.game.events.on('toggle-interaction', (enabled: boolean) => {
      this.interactionEnabled = enabled;
      this.input.enabled = enabled;
    });
    
    // Check initial state
    this.interactionEnabled = this.registry.get('interactionEnabled') || false;
    this.input.enabled = this.interactionEnabled;
  }

  private createCar() {
    // Create car as rectangle for now (can be replaced with sprite)
    const carWidth = 60;
    const carHeight = 30;
    
    const carContainer = this.add.container(this.START_X, this.GROUND_Y - carHeight/2);
    
    // Car body
    const carRect = this.add.rectangle(0, 0, carWidth, carHeight, 0xff4444);
    const wheel1 = this.add.circle(-15, carHeight/2 - 5, 8, 0x333333);
    const wheel2 = this.add.circle(15, carHeight/2 - 5, 8, 0x333333);
    
    carContainer.add([carRect, wheel1, wheel2]);
    carContainer.setSize(carWidth, carHeight);
    
    this.physics.add.existing(carContainer);
    this.car = carContainer as unknown as Phaser.GameObjects.Sprite;
    this.carBody = carContainer.body as Phaser.Physics.Arcade.Body;
    
    this.carBody.setCollideWorldBounds(true);
    this.carBody.setBounce(0.2);
    this.carBody.setDrag(0); // We'll handle friction manually
  }

  private createSurfaceButtons() {
    const startY = 80;
    const buttonWidth = 100;
    
    Object.entries(this.surfaces).forEach(([key, config], index) => {
      const x = 20 + index * (buttonWidth + 10);
      
      const button = this.add.text(x, startY, config.label, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: `#${config.color.toString(16).padStart(6, '0')}`,
        padding: { x: 10, y: 8 }
      })
      .setInteractive({ useHandCursor: true });
      
      button.on('pointerdown', () => {
        this.currentSurface = key as SurfaceType;
        this.drawSurface();
        this.resetCar();
      });
      
      button.on('pointerover', () => button.setAlpha(0.8));
      button.on('pointerout', () => button.setAlpha(1));
    });
  }

  private drawSurface() {
    this.surfaceGraphics.clear();
    
    const config = this.surfaces[this.currentSurface];
    
    // Draw ground surface
    this.surfaceGraphics.fillStyle(config.color, 1);
    this.surfaceGraphics.fillRect(0, this.GROUND_Y, 800, 200);
    
    // Draw surface label
    this.add.text(650, this.GROUND_Y + 20, `Surface: ${config.label}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#000000'
    });
    
    // Draw coefficient
    this.add.text(650, this.GROUND_Y + 45, `μ = ${config.friction}`, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#666666'
    });
  }

  private setupDragMechanics() {
    // Slingshot-style push: drag back to charge, release to launch
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.interactionEnabled) return;
      
      const carBounds = this.car.getBounds();
      if (carBounds.contains(pointer.x, pointer.y)) {
        this.isDragging = true;
        this.dragStartX = pointer.x;
        this.carBody.setVelocity(0);
      }
    });
    
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isDragging) return;
      
      // Calculate pull-back distance
      const pullBack = Math.max(0, this.dragStartX - pointer.x);
      this.pushForce = Math.min(pullBack * 5, 500); // Max 500 force
      
      // Draw pull indicator
      this.graphics.clear();
      this.graphics.lineStyle(3, 0x00ff00, 0.7);
      this.graphics.lineBetween(this.car.x, this.car.y, pointer.x, this.car.y);
      
      // Show force indicator
      this.graphics.fillStyle(0x00ff00, 0.3);
      this.graphics.fillRect(this.car.x - pullBack, this.car.y - 20, pullBack, 10);
    });
    
    this.input.on('pointerup', () => {
      if (!this.isDragging) return;
      
      this.isDragging = false;
      this.graphics.clear();
      
      // Launch car with accumulated force
      if (this.pushForce > 0) {
        this.carBody.setVelocityX(this.pushForce);
        this.pushForce = 0;
      }
    });
  }

  private resetCar() {
    this.car.x = this.START_X;
    this.carBody.setVelocity(0);
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
    .setScrollFactor(0);

    button.on('pointerdown', () => {
      const onGameComplete = this.registry.get('onGameComplete');
      if (onGameComplete) {
        onGameComplete();
      }
    });

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#16a34a' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#22c55e' }));
  }

  update() {
    if (!this.carBody) return;
    
    // Apply friction deceleration
    const velocity = this.carBody.velocity.x;
    if (Math.abs(velocity) > 0.1) {
      const friction = this.surfaces[this.currentSurface].friction;
      const deceleration = friction * this.GRAVITY;
      
      // Apply deceleration opposing motion
      const newVelocity = velocity > 0 
        ? Math.max(0, velocity - deceleration * (1/60))
        : Math.min(0, velocity + deceleration * (1/60));
      
      this.carBody.setVelocityX(newVelocity);
    } else {
      this.carBody.setVelocityX(0);
    }
    
    // Emit car data for overlay
    this.updateCarData();
    this.game.events.emit('car-updated', this.carData);
  }

  private updateCarData() {
    this.carData.x = this.car.x;
    this.carData.y = this.car.y;
    this.carData.velocityX = this.carBody.velocity.x;
    this.carData.velocityY = this.carBody.velocity.y;
    this.carData.surface = this.currentSurface;
    this.carData.friction = this.surfaces[this.currentSurface].friction;
  }
}
```

## Files to Create/Modify
- **Create:** `frontend/components/game/scenes/FrictionScene.ts`
- **Modify:** `frontend/components/game/PhaserGame.tsx` (add scene import and registration)

## Acceptance Criteria
- [ ] Car can be dragged back and released to push forward
- [ ] Three surface buttons change the ground appearance and friction
- [ ] Car decelerates realistically based on surface friction coefficient
- [ ] Car stops completely when velocity is near zero
- [ ] `car-updated` event emits continuously for overlay consumption
- [ ] Complete button triggers phase progression callback

## Verification Steps
1. Load friction lab at `/lab/friction-1` (or similar route)
2. Verify car is visible on wood surface by default
3. Drag car backward and release - observe forward motion
4. Switch surfaces and observe different stopping distances
5. Toggle overlay to see friction vectors (requires Task 7.3)
6. Click Complete to proceed to observation phase

## Dependencies
- Phaser.js already integrated in project
- LabLayout and LabNotebook infrastructure in place

## Notes
- Keep physics feel kid-friendly (not overly complex)
- Consider adding visual car sprite later (placeholder rectangle is fine for MVP)
- Sound effects can be added in Task 7.5 (Polish)
