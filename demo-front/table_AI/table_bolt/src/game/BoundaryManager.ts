import Matter from 'matter-js';
import type { TableDimensions, TABLE_BOUND, Ball } from './types';

/**
 * 创建台球桌的四面墙壁
 * @param engine - Matter.js 的物理引擎实例
 */
export function createWalls(engine: Matter.Engine, { tableWidth, tableHeight, wallColor, wallWidth }: TableDimensions) {
  const wallConfig = {
    isStatic: true,          // 静态物体，不会受物理模拟影响
    isSensor: false, // 传感器，不参与物理碰撞，仅用于检测
    render: { fillStyle: wallColor }, // 设置墙壁颜色
    friction: 0.2,           // 摩擦系数
    restitution: 0.6        // 弹性系数
  };
  // 创建四面墙壁，使用静态矩形体表示墙壁
  const walls = [
    // 上墙
    Matter.Bodies.rectangle(tableWidth / 2, wallWidth / 2, tableWidth, wallWidth, wallConfig),
    // 下墙
    Matter.Bodies.rectangle(tableWidth / 2, tableHeight - wallWidth / 2, tableWidth, wallWidth, wallConfig),
    // 左墙
    Matter.Bodies.rectangle(wallWidth / 2, tableHeight / 2, wallWidth, tableHeight, wallConfig),
    // 右墙
    Matter.Bodies.rectangle(tableWidth - wallWidth / 2, tableHeight / 2, wallWidth, tableHeight, wallConfig)
  ].map(item => {
    (item as any).wall = true;  // 给墙壁附加类型信息
    return item;
  });

  // 将墙壁添加到物理世界中
  Matter.Composite.add(engine.world, walls);
  return walls
}