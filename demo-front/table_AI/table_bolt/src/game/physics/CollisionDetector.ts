import Matter from 'matter-js';
import { Vector } from './Vector';

export class CollisionDetector {
  static detectCollision(
    ball: Matter.Body,
    targetBalls: Matter.Body[],
    engine: Matter.Engine
  ): Matter.Collision | null {
    const pairs = Matter.Query.collides(ball, targetBalls, engine);
    return pairs.length > 0 ? pairs[0].collision : null;
  }

  static calculateCollisionAngle(collision: Matter.Collision): number {
    const normal = collision.normal;
    return Math.atan2(normal.y, normal.x);
  }

  static calculateReflectionAngle(incomingAngle: number, surfaceAngle: number): number {
    const normalAngle = surfaceAngle + Math.PI / 2;
    return 2 * normalAngle - incomingAngle - Math.PI;
  }
}