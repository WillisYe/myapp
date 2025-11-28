export class Vector {
  static create(x: number, y: number) {
    return { x, y };
  }

  static magnitude(vector: { x: number, y: number }): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }

  static normalize(vector: { x: number, y: number }) {
    const mag = this.magnitude(vector);
    return mag === 0 ? { x: 0, y: 0 } : { x: vector.x / mag, y: vector.y / mag };
  }

  static multiply(vector: { x: number, y: number }, scalar: number) {
    return { x: vector.x * scalar, y: vector.y * scalar };
  }

  static add(v1: { x: number, y: number }, v2: { x: number, y: number }) {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }
}