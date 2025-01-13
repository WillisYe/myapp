import Matter from 'matter-js';
import { Vector } from './Vector';
import { CollisionDetector } from './CollisionDetector';

export class TrajectorySimulator {
  private readonly timeStep = 1000 / 60;
  private readonly maxSteps = 60;
  private readonly friction = 0.005;

  simulateTrajectory(
    startPos: Matter.Vector,
    velocity: Matter.Vector,
    obstacles: Matter.Body[],
    engine: Matter.Engine
  ): Array<Matter.Vector> {
    const trajectory: Matter.Vector[] = [{ ...startPos }];
    let currentPos = { ...startPos };
    let currentVel = { ...velocity };

    for (let i = 0; i < this.maxSteps; i++) {
      // Apply friction
      currentVel = {
        x: currentVel.x * (1 - this.friction),
        y: currentVel.y * (1 - this.friction)
      };

      // Update position
      currentPos = {
        x: currentPos.x + currentVel.x,
        y: currentPos.y + currentVel.y
      };

      // Check for collisions with walls
      if (currentPos.x < 30 || currentPos.x > 770) {
        currentVel.x *= -0.8;
      }
      if (currentPos.y < 30 || currentPos.y > 570) {
        currentVel.y *= -0.8;
      }

      trajectory.push({ ...currentPos });

      // Stop if velocity becomes too small
      if (Math.abs(currentVel.x) < 0.1 && Math.abs(currentVel.y) < 0.1) {
        break;
      }
    }

    return trajectory;
  }
}