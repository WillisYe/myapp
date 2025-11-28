import Matter from 'matter-js';
import type { TableDimensions } from './types';

/**
 * 创建台球桌的四面墙壁
 * @param engine - Matter.js 的物理引擎实例
 */
export function createTable(engine: Matter.Engine, { tableWidth, tableHeight, tableColor, wallWidth }: TableDimensions) {
  const tableConfig = {
    isStatic: true,          // 静态物体，不会受物理模拟影响
    isSensor: true, // 传感器，不参与物理碰撞，仅用于检测
    render: { fillStyle: tableColor }, // 设置墙壁颜色
    friction: 0.2,           // 摩擦系数
    restitution: 0.6        // 弹性系数
  };
  var table = Matter.Bodies.rectangle(tableWidth / 2, tableHeight / 2, tableWidth, tableHeight, tableConfig)

  // 将墙壁添加到物理世界中
  Matter.Composite.add(engine.world, [table]);
  return table
}

// 检测鼠标是否在球桌区域内
export function isInTable(x: number, y: number, { tableWidth, tableHeight }: TableDimensions): boolean {
  return x >= 0 && x <= tableWidth &&
    y >= 0 && y <= tableHeight;
}