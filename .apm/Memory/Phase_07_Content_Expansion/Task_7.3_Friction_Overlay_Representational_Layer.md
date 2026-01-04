# Task 7.3: FrictionOverlayScene.ts - Representational Layer

## Status: Pending

## Goal
Create a Phaser overlay scene that visualizes friction force vectors and physics data, enabling students to see the invisible forces acting on the car.

## Requirements
- [ ] Create `FrictionOverlayScene.ts` as parallel scene
- [ ] Draw friction force vector (opposing motion)
- [ ] Draw initial applied force vector (push direction)
- [ ] Display coefficient of friction (μ) value
- [ ] Show distance traveled indicator
- [ ] Respond to toggle-overlay events from React

## VRA Representational Layer Purpose
The overlay transforms abstract physics concepts into visual representations:
- **Friction Force** → Red arrow opposing car's velocity
- **Applied Force** → Green arrow showing initial push
- **Coefficient** → Numeric label showing μ value
- **Distance** → Visual ruler/measurement

## Technical Implementation

### File: `frontend/components/game/scenes/FrictionOverlayScene.ts`

```typescript
import Phaser from 'phaser';

interface CarData {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  surface: string;
  friction: number;
}

export class FrictionOverlayScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private isActive: boolean = false;
  private carData: CarData | null = null;
  
  // Track starting position for distance calculation
  private startX: number = 100;
  private maxX: number = 100;
  
  // Text displays
  private coefficientText!: Phaser.GameObjects.Text;
  private distanceText!: Phaser.GameObjects.Text;
  private forceLabel!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'FrictionOverlayScene', active: true });
  }

  create() {
    this.graphics = this.add.graphics();
    
    // Create persistent text labels (hidden initially)
    this.coefficientText = this.add.text(10, 130, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#4a5568',
      backgroundColor: '#f7fafc',
      padding: { x: 8, y: 4 }
    }).setVisible(false);
    
    this.distanceText = this.add.text(10, 160, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#4a5568',
      backgroundColor: '#f7fafc',
      padding: { x: 8, y: 4 }
    }).setVisible(false);
    
    this.forceLabel = this.add.text(0, 0, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#ef4444',
      padding: { x: 4, y: 2 }
    }).setVisible(false);

    // Listen for overlay toggle from React
    this.game.events.on('toggle-overlay', (active: boolean) => {
      this.isActive = active;
      if (!active) {
        this.graphics.clear();
        this.coefficientText.setVisible(false);
        this.distanceText.setVisible(false);
        this.forceLabel.setVisible(false);
      }
    });

    // Listen for car data updates from FrictionScene
    this.game.events.on('car-updated', (data: CarData) => {
      this.carData = data;
      // Track maximum distance traveled
      if (data.x > this.maxX) {
        this.maxX = data.x;
      }
    });
    
    // Reset distance tracking when car is reset
    this.game.events.on('car-reset', () => {
      this.maxX = this.startX;
    });
  }

  update() {
    if (!this.isActive || !this.carData) return;
    
    this.graphics.clear();
    
    // Draw all overlay elements
    this.drawFrictionVector();
    this.drawDistanceIndicator();
    this.updateInfoText();
  }

  private drawFrictionVector() {
    if (!this.carData) return;
    
    const { x, y, velocityX, friction } = this.carData;
    
    // Only show friction arrow when car is moving
    if (Math.abs(velocityX) < 1) {
      this.forceLabel.setVisible(false);
      return;
    }
    
    // Calculate friction force magnitude (for visualization)
    const frictionForce = Math.min(Math.abs(velocityX) * friction * 0.5, 80);
    
    // Friction always opposes motion
    const direction = velocityX > 0 ? -1 : 1;
    
    const arrowEndX = x + direction * frictionForce;
    const arrowY = y;
    
    // Draw friction force arrow (red)
    this.graphics.lineStyle(4, 0xef4444, 0.9);
    this.graphics.beginPath();
    this.graphics.moveTo(x, arrowY);
    this.graphics.lineTo(arrowEndX, arrowY);
    this.graphics.strokePath();
    
    // Draw arrowhead
    this.drawArrowhead(arrowEndX, arrowY, direction > 0 ? 0 : Math.PI, 0xef4444);
    
    // Position friction label
    this.forceLabel.setText('Friction');
    this.forceLabel.setPosition(
      x + direction * (frictionForce / 2) - 25,
      arrowY - 25
    );
    this.forceLabel.setVisible(true);
    
    // Draw velocity arrow (green, showing current motion)
    if (Math.abs(velocityX) > 5) {
      const velocityArrowLength = Math.min(Math.abs(velocityX) * 0.3, 60);
      const velocityDirection = velocityX > 0 ? 1 : -1;
      
      this.graphics.lineStyle(3, 0x22c55e, 0.8);
      this.graphics.beginPath();
      this.graphics.moveTo(x, arrowY + 15);
      this.graphics.lineTo(x + velocityDirection * velocityArrowLength, arrowY + 15);
      this.graphics.strokePath();
      
      this.drawArrowhead(
        x + velocityDirection * velocityArrowLength, 
        arrowY + 15, 
        velocityDirection > 0 ? 0 : Math.PI, 
        0x22c55e
      );
    }
  }

  private drawArrowhead(x: number, y: number, angle: number, color: number) {
    const headLength = 12;
    const headAngle = Math.PI / 6;
    
    this.graphics.fillStyle(color, 0.9);
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(
      x - headLength * Math.cos(angle - headAngle),
      y - headLength * Math.sin(angle - headAngle)
    );
    this.graphics.lineTo(
      x - headLength * Math.cos(angle + headAngle),
      y - headLength * Math.sin(angle + headAngle)
    );
    this.graphics.closePath();
    this.graphics.fillPath();
  }

  private drawDistanceIndicator() {
    if (!this.carData) return;
    
    const groundY = 400; // Match FrictionScene ground level
    
    // Draw distance ruler from start to max position
    const rulerY = groundY + 50;
    const distance = Math.round(this.maxX - this.startX);
    
    if (distance > 10) {
      // Ruler line
      this.graphics.lineStyle(2, 0x6366f1, 0.8);
      this.graphics.beginPath();
      this.graphics.moveTo(this.startX, rulerY);
      this.graphics.lineTo(this.maxX, rulerY);
      this.graphics.strokePath();
      
      // Start tick
      this.graphics.lineBetween(this.startX, rulerY - 5, this.startX, rulerY + 5);
      
      // End tick
      this.graphics.lineBetween(this.maxX, rulerY - 5, this.maxX, rulerY + 5);
      
      // Distance markers every 100px
      for (let x = this.startX + 100; x < this.maxX; x += 100) {
        this.graphics.lineBetween(x, rulerY - 3, x, rulerY + 3);
      }
    }
  }

  private updateInfoText() {
    if (!this.carData) return;
    
    // Show coefficient of friction
    this.coefficientText.setText(`Friction Coefficient (μ): ${this.carData.friction}`);
    this.coefficientText.setVisible(true);
    
    // Show distance traveled
    const distance = Math.round(this.maxX - this.startX);
    this.distanceText.setText(`Distance Traveled: ${distance} px`);
    this.distanceText.setVisible(true);
  }
}
```

## Overlay Elements Specification

### 1. Friction Force Vector (Red Arrow)
- **Direction:** Always opposes current velocity
- **Length:** Proportional to friction coefficient × velocity
- **Color:** `#ef4444` (red-500)
- **Label:** "Friction" text above arrow

### 2. Velocity Vector (Green Arrow)
- **Direction:** Same as current velocity
- **Length:** Proportional to current speed
- **Color:** `#22c55e` (green-500)
- **Shows when:** Car is moving

### 3. Distance Ruler (Purple Line)
- **Position:** Below the ground surface
- **Shows:** Start position to maximum position reached
- **Tick marks:** Every 100 pixels
- **Color:** `#6366f1` (indigo-500)

### 4. Info Panel
- **Coefficient Display:** "Friction Coefficient (μ): 0.3"
- **Distance Display:** "Distance Traveled: 245 px"
- **Position:** Top-left corner
- **Background:** Light gray for readability

## Integration Points

### Event Listeners
```typescript
// From React (LabLayout toggle button)
this.game.events.on('toggle-overlay', (active: boolean) => {});

// From FrictionScene (car position updates)
this.game.events.on('car-updated', (data: CarData) => {});

// From FrictionScene (car reset)
this.game.events.on('car-reset', () => {});
```

### Event Emitters (in FrictionScene)
```typescript
// In update() loop
this.game.events.emit('car-updated', this.carData);

// In resetCar() method
this.game.events.emit('car-reset');
```

## Files to Create/Modify
- **Create:** `frontend/components/game/scenes/FrictionOverlayScene.ts`
- **Modify:** `frontend/components/game/PhaserGame.tsx` (register new scene)

## Scene Registration
```typescript
// In PhaserGame.tsx, add FrictionOverlayScene to scene array
import { FrictionOverlayScene } from './scenes/FrictionOverlayScene';

// In config
scene: [FrictionScene, FrictionOverlayScene, /* other scenes */]
```

## Acceptance Criteria
- [ ] Overlay toggle button activates friction overlay
- [ ] Red friction arrow appears opposing car motion
- [ ] Green velocity arrow shows current motion direction
- [ ] Distance ruler shows from start to max position
- [ ] Coefficient value displays correctly for each surface
- [ ] All elements clear when overlay is toggled off
- [ ] Performance remains smooth (60 FPS)

## Verification Steps
1. Load friction lab and interact with simulation
2. Toggle overlay on via "Spectacles" button
3. Push car and observe red friction arrow appears
4. Verify arrow points opposite to motion direction
5. Switch surfaces and verify coefficient display changes
6. Observe distance ruler grows as car travels
7. Toggle overlay off and verify all elements disappear

## Visual Mockup (ASCII)

```
┌─────────────────────────────────────────────────────────┐
│  Friction Lab: Push the car on different surfaces       │
│  ┌────────┐  [Friction Coefficient (μ): 0.3]           │
│  │ μ=0.02 │ μ=0.3  │ μ=0.8  │                          │
│  │  Ice   │ Wood   │ Rubber │                          │
│  └────────┴────────┴────────┘                          │
│                                                         │
│                          ┌──Friction──┐                 │
│                          │            ↓                 │
│         ←════════════════[🚗 CAR]═════════════→         │
│                          ↑                              │
│                        Motion                           │
│ ═══════════════════════════════════════════════════════ │ (ground)
│  ├────┬────┬────┬────┬────┬────┬────┤                  │
│  0   100  200  300  400  500  600  px                  │
│  [Distance Traveled: 432 px]                           │
└─────────────────────────────────────────────────────────┘
```

## Dependencies
- Task 7.1 (FrictionScene) must emit `car-updated` events
- LabLayout's overlay toggle button must emit `toggle-overlay`

## Notes
- Keep vectors readable (not too many overlapping elements)
- Use consistent colors with MagnetsScene overlay (red=opposing, green=motion)
- Consider adding legend on first use (future enhancement)
- Distance could optionally show in "cm" or "m" for realism
