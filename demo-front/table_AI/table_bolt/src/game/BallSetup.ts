import Matter from 'matter-js';
import { drawBallNumber } from './BallRenderer';
import type { TableDimensions, Ball } from './types';

// 球的相关配置
const ballConfig = {  
  restitution: 1, // 弹性系数，值越大，弹性越大
  friction: 0.9,    // 摩擦系数，值越大，摩擦力越大
  density: 0.01     // 密度，影响质量
}

/**
 * 创建游戏中的所有球
 * @param engine - Matter.js 的物理引擎实例
 * @param tableDimensions - 包含球桌宽度、高度和球半径的对象
 * @returns 返回包含所有球的数组
 */
export function createBalls(engine: Matter.Engine, tableDimensions: TableDimensions): Ball[] {
  // 解构 tableDimensions 对象
  const { tableWidth, tableHeight, ballRadius, whitePosition } = tableDimensions;

  // 定义球的半径
  const BALL_RADIUS = ballRadius;
  const balls: Ball[] = [];

  // 创建白球
  const whiteBall = Matter.Bodies.circle(
    whitePosition.x,    // 白球的 x 坐标，位于球桌中央
    whitePosition.y, // 白球的 y 坐标，位于球桌底部四分之三处
    BALL_RADIUS,       // 球的半径
    ballConfig         // 球的物理配置
  );
  (whiteBall as any).ball = { type: 'white' };  // 给白球附加类型信息
  drawBallNumber(whiteBall, 0, BALL_RADIUS);  // 在白球上绘制编号
  balls.push({
    id: 0,             // 球的唯一标识符
    type: 'white',     // 球的类型
    pocketed: false,   // 是否被袋入
    body: whiteBall    // Matter.js 的刚体对象
  });

  // 设置等边三角形排列的起始位置和参数
  const startX = tableWidth / 2;  // 起始 X 坐标，位于球桌中央
  const startY = tableHeight / 3 - BALL_RADIUS * 2.5; // 起始 Y 坐标，位于球桌三分之一处
  const rows = 5;  // 球的行数

  // 预定义的球配置列表
  const ballsConfig = [
    { id: 1, type: 'solid' },
    { id: 9, type: 'stripe' },
    { id: 2, type: 'solid' },
    { id: 10, type: 'stripe' },
    { id: 8, type: 'black' },
    { id: 11, type: 'stripe' },
    { id: 3, type: 'solid' },
    { id: 12, type: 'stripe' },
    { id: 4, type: 'solid' },
    { id: 13, type: 'stripe' },
    { id: 5, type: 'solid' },
    { id: 14, type: 'stripe' },
    { id: 6, type: 'solid' },
    { id: 15, type: 'stripe' },
    { id: 7, type: 'solid' }
  ];

  let ballIndex = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col <= row; col++) {
      if (ballIndex >= ballsConfig.length) break; // 如果所有球都已创建，退出循环

      // 计算每个球的 x 和 y 坐标
      const x = startX + (col * BALL_RADIUS * 2) - (row * BALL_RADIUS);
      const y = startY - (row * BALL_RADIUS * 2);

      const ballInfo = ballsConfig[ballIndex];
      const ball = Matter.Bodies.circle(
        x,               // 球的 x 坐标
        y,               // 球的 y 坐标
        BALL_RADIUS,     // 球的半径
        ballConfig       // 球的物理配置
      );

      (ball as any).ball = { type: ballInfo.type };  // 给球附加类型信息
      drawBallNumber(ball, ballInfo.id, BALL_RADIUS);  // 在球上绘制编号

      balls.push({
        id: ballInfo.id, // 球的唯一标识符
        type: ballInfo.type as Ball['type'], // 球的类型
        pocketed: false, // 是否被袋入
        body: ball       // Matter.js 的刚体对象
      });

      ballIndex++;
    }
  }

  // 将所有球添加到物理世界中
  Matter.Composite.add(engine.world, balls.map(ball => ball.body));
  return balls;
}