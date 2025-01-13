import Matter from 'matter-js';
import type { TableDimensions, Ball } from './types';
import { TrajectorySimulator } from './physics/TrajectorySimulator';

export class AimingSystem {
  // 静态属性，用于模拟轨迹
  private static trajectorySimulator = new TrajectorySimulator();

  /**
   * 查找最近的目标球
   * @param whiteBall 白球对象
   * @param angle 瞄准角度
   * @param balls 球列表
   * @returns 目标球及其交点，或 null 如果没有找到目标球
   */
  static findTargetBall(
    whiteBall: Ball,
    angle: number,
    balls: Ball[]
  ): { ball: Ball; intersection: Matter.Vector } | null {
    const direction = { x: Math.cos(angle), y: Math.sin(angle) }; // 计算方向向量
    let closestBall: Ball | null = null;
    let closestDistance = Infinity;
    let intersection = { x: 0, y: 0 };

    for (const ball of balls) {
      if (ball.pocketed || ball.type === 'white') continue; // 跳过已击入袋中或白球

      const dx = ball.body.position.x - whiteBall.body.position.x;
      const dy = ball.body.position.y - whiteBall.body.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy); // 计算距离

      // 将球的位置投影到瞄准线上
      const dot = dx * direction.x + dy * direction.y;
      if (dot <= 0) continue; // 球在白球后面

      const projX = whiteBall.body.position.x + direction.x * dot;
      const projY = whiteBall.body.position.y + direction.y * dot;

      const distToLine = Math.sqrt(
        Math.pow(ball.body.position.x - projX, 2) +
        Math.pow(ball.body.position.y - projY, 2)
      );

      if (distToLine < 30 && distance < closestDistance) {
        closestBall = ball;
        closestDistance = distance;
        intersection = { x: projX, y: projY };
      }
    }

    return closestBall ? { ball: closestBall, intersection } : null;
  }

  /**
   * 绘制瞄准线和预测轨迹
   * @param ctx CanvasRenderingContext2D 对象
   * @param whiteBall 白球对象
   * @param targetInfo 目标球及其交点信息
   * @param angle 瞄准角度
   * @param power 力量值
   */
  static draw(
    ctx: CanvasRenderingContext2D,
    whiteBall: Ball,
    targetInfo: { ball: Ball; intersection: Matter.Vector } | null,
    angle: number,
    power: number,
    { tableWidth, tableHeight, wallWidth }: TableDimensions
  ) {
    // 绘制瞄准线
    ctx.beginPath();
    ctx.moveTo(whiteBall.body.position.x, whiteBall.body.position.y);

    if (targetInfo && false) {
      // 绘制到目标球的线
      ctx.lineTo(targetInfo.ball.body.position.x, targetInfo.ball.body.position.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.stroke();

      // 计算碰撞后的速度分量
      const force = power * 0.02;
      const dx = targetInfo.ball.body.position.x - whiteBall.body.position.x;
      const dy = targetInfo.ball.body.position.y - whiteBall.body.position.y;
      const collisionAngle = Math.atan2(dy, dx);

      // 模拟白球碰撞后的轨迹
      const whiteTrajectory = this.trajectorySimulator.simulateTrajectory(
        targetInfo.ball.body.position,
        {
          x: force * Math.cos(collisionAngle + Math.PI) * 0.8,
          y: force * Math.sin(collisionAngle + Math.PI) * 0.8
        },
        [],
        whiteBall.body.engine
      );

      // 模拟目标球碰撞后的轨迹
      const targetTrajectory = this.trajectorySimulator.simulateTrajectory(
        targetInfo.ball.body.position,
        {
          x: force * Math.cos(collisionAngle) * 0.8,
          y: force * Math.sin(collisionAngle) * 0.8
        },
        [],
        whiteBall.body.engine
      );

      // 绘制白球轨迹
      ctx.beginPath();
      ctx.moveTo(whiteTrajectory[0].x, whiteTrajectory[0].y);
      whiteTrajectory.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([5, 5]);
      ctx.stroke();

      // 绘制目标球轨迹
      ctx.beginPath();
      ctx.moveTo(targetTrajectory[0].x, targetTrajectory[0].y);
      targetTrajectory.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
      ctx.stroke();
    } else {
      // 如果没有目标球，绘制简单的瞄准线
      var { x, y } = this.findIntersectionWithTable(whiteBall, angle, { left: wallWidth, right: tableWidth - wallWidth*1, top: wallWidth, bottom: tableHeight - wallWidth*1 });
      ctx.lineTo( x, y );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
    }

    ctx.setLineDash([]); // 重置虚线样式
  }

  /**
   * 计算瞄准线与球桌的交点
   * @param whiteBall 白球对象
   * @param angle 瞄准角度
   * @param tableBounds 球桌边界 { left, right, top, bottom }
   * @returns 瞄准线与球桌的交点
   */
  static findIntersectionWithTable(
    whiteBall: Ball,
    angle: number,
    tableBounds: { left: number; right: number; top: number; bottom: number }
  ): Matter.Vector | null {
    const direction = { x: Math.cos(angle), y: Math.sin(angle) };
    const startX = whiteBall.body.position.x;
    const startY = whiteBall.body.position.y;

    // 定义球桌的边界线段
    const tableEdges = [
      { x1: tableBounds.left, y1: tableBounds.top, x2: tableBounds.right, y2: tableBounds.top }, // 上边界
      { x1: tableBounds.right, y1: tableBounds.top, x2: tableBounds.right, y2: tableBounds.bottom }, // 右边界
      { x1: tableBounds.right, y1: tableBounds.bottom, x2: tableBounds.left, y2: tableBounds.bottom }, // 下边界
      { x1: tableBounds.left, y1: tableBounds.bottom, x2: tableBounds.left, y2: tableBounds.top } // 左边界
    ];

    let closestIntersection: Matter.Vector | null = null;
    let closestDistance = Infinity;

    for (const edge of tableEdges) {
      const intersection = this.lineIntersect(
        startX, startY, startX + direction.x * 1000, startY + direction.y * 1000,
        edge.x1, edge.y1, edge.x2, edge.y2
      );

      if (intersection) {
        const distance = Math.sqrt(
          Math.pow(intersection.x - startX, 2) +
          Math.pow(intersection.y - startY, 2)
        );

        if (distance < closestDistance) {
          closestIntersection = intersection;
          closestDistance = distance;
        }
      }
    }

    return closestIntersection;
  }

  /**
   * 计算两条线段的交点
   * @param x1 第一条线段起点 x 坐标
   * @param y1 第一条线段起点 y 坐标
   * @param x2 第一条线段终点 x 坐标
   * @param y2 第一条线段终点 y 坐标
   * @param x3 第二条线段起点 x 坐标
   * @param y3 第二条线段起点 y 坐标
   * @param x4 第二条线段终点 x 坐标
   * @param y4 第二条线段终点 y 坐标
   * @returns 交点坐标或 null 如果没有交点
   */
  private static lineIntersect(
    x1: number, y1: number, x2: number, y2: number,
    x3: number, y3: number, x4: number, y4: number
  ): Matter.Vector | null {
    const denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));

    if (denominator === 0) {
      return null; // 线段平行或重合
    }

    const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / denominator;
    const u = -(((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / denominator;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      const intersectionX = x1 + t * (x2 - x1);
      const intersectionY = y1 + t * (y2 - y1);
      return { x: intersectionX, y: intersectionY };
    }

    return null; // 没有交点
  }
}