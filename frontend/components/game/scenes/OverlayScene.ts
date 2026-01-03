import Phaser from 'phaser';

export class OverlayScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private isActive: boolean = false;
  private magnets: { x: number; y: number; pole: 'north' | 'south' }[] = [];

  constructor() {
    super({ key: 'OverlayScene', active: true });
  }

  create() {
    this.graphics = this.add.graphics();
    
    // Listen for overlay toggle from React
    this.game.events.on('toggle-overlay', (active: boolean) => {
      this.isActive = active;
      if (!active) {
        this.graphics.clear();
      }
    });

    // Listen for magnet position updates from MagnetsScene
    this.game.events.on('magnets-updated', (magnets: { x: number; y: number; pole: 'north' | 'south' }[]) => {
      this.magnets = magnets;
    });
  }

  update() {
    if (!this.isActive || this.magnets.length < 2) return;
    
    this.graphics.clear();
    
    // Draw force vectors between magnets
    for (let i = 0; i < this.magnets.length; i++) {
      for (let j = i + 1; j < this.magnets.length; j++) {
        this.drawForceVector(this.magnets[i], this.magnets[j]);
      }
    }
  }

  private drawForceVector(m1: { x: number; y: number; pole: 'north' | 'south' }, 
                          m2: { x: number; y: number; pole: 'north' | 'south' }) {
    const dx = m2.x - m1.x;
    const dy = m2.y - m1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 10) return;
    
    // Determine if attraction (opposite poles) or repulsion (same poles)
    const isAttraction = m1.pole !== m2.pole;
    const color = isAttraction ? 0x00ff00 : 0xff0000; // Green for attract, Red for repel
    
    // Calculate force magnitude (inverse square law, simplified)
    const forceMagnitude = Math.min(100, 5000 / (distance * distance) * 100);
    
    // Draw arrow from m1 toward/away from m2
    const angle = Math.atan2(dy, dx);
    const arrowLength = forceMagnitude;
    
    // Direction depends on attraction vs repulsion
    const direction = isAttraction ? 1 : -1;
    const endX = m1.x + Math.cos(angle) * arrowLength * direction;
    const endY = m1.y + Math.sin(angle) * arrowLength * direction;
    
    this.graphics.lineStyle(3, color, 0.8);
    this.graphics.beginPath();
    this.graphics.moveTo(m1.x, m1.y);
    this.graphics.lineTo(endX, endY);
    this.graphics.strokePath();
    
    // Draw arrowhead
    this.drawArrowhead(endX, endY, angle + (isAttraction ? 0 : Math.PI), color);
    
    // Draw same from m2's perspective
    const endX2 = m2.x - Math.cos(angle) * arrowLength * direction;
    const endY2 = m2.y - Math.sin(angle) * arrowLength * direction;
    
    this.graphics.beginPath();
    this.graphics.moveTo(m2.x, m2.y);
    this.graphics.lineTo(endX2, endY2);
    this.graphics.strokePath();
    
    this.drawArrowhead(endX2, endY2, angle + Math.PI + (isAttraction ? 0 : Math.PI), color);
  }

  private drawArrowhead(x: number, y: number, angle: number, color: number) {
    const headLength = 10;
    const headAngle = Math.PI / 6;
    
    this.graphics.fillStyle(color, 0.8);
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
}
