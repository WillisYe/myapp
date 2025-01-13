import Matter from 'matter-js';

// 常量定义
const POCKET_RADIUS = 20; // 袋口的半径
const POCKET_POSITIONS = [
  { x: 20, y: 20 },   // 左上
  { x: 400, y: 10 },  // 中上
  { x: 780, y: 20 },  // 右上
  { x: 20, y: 580 },  // 左下
  { x: 400, y: 590 }, // 中下
  { x: 780, y: 580 }  // 右下
];

/**
 * 设置物理引擎
 * @returns 初始化后的物理引擎实例
 */
export function setupPhysics() {
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: 0 }, // 重力设置为0，表示无重力环境
  });
  
  engine.world.gravity.scale = 0; // 确保重力缩放为0
  engine.constraintIterations = 4; // 约束迭代次数
  engine.positionIterations = 8; // 位置迭代次数
  engine.velocityIterations = 8; // 速度迭代次数
  
  return engine;
}

/**
 * 创建球台边界和袋口传感器
 * @param engine 物理引擎实例
 */
export function createWalls(engine: Matter.Engine) {
  // 创建球台边框
  const walls = [
    // 上边界
    Matter.Bodies.rectangle(400, 0, 800, 20, { 
      isStatic: true, // 静态物体，不会移动
      render: { fillStyle: '#654321' }, // 渲染颜色
      friction: 0.2, // 摩擦系数
      restitution: 0.6 // 弹性系数
    }),
    // 下边界
    Matter.Bodies.rectangle(400, 600, 800, 20, { 
      isStatic: true,
      render: { fillStyle: '#654321' },
      friction: 0.2,
      restitution: 0.6
    }),
    // 左边界
    Matter.Bodies.rectangle(0, 300, 20, 600, { 
      isStatic: true,
      render: { fillStyle: '#654321' },
      friction: 0.2,
      restitution: 0.6
    }),
    // 右边界
    Matter.Bodies.rectangle(800, 300, 20, 600, { 
      isStatic: true,
      render: { fillStyle: '#654321' },
      friction: 0.2,
      restitution: 0.6
    })
  ];

  // 创建袋口传感器
  POCKET_POSITIONS.forEach(pos => {
    const pocket = Matter.Bodies.circle(pos.x, pos.y, POCKET_RADIUS, {
      isStatic: true, // 静态物体
      isSensor: true, // 传感器，不参与物理碰撞，仅用于检测
      render: { fillStyle: '#000000' } // 渲染颜色
    });
    walls.push(pocket);
  });
  
  Matter.Composite.add(engine.world, walls); // 将边界和袋口添加到物理世界
}

/**
 * 检查球是否与袋口发生碰撞
 * @param ball 球体对象
 * @param pocketPos 袋口位置
 * @returns 是否发生碰撞
 */
export function checkPocketCollision(ball: Matter.Body, pocketPos: { x: number, y: number }): boolean {
  const dx = ball.position.x - pocketPos.x;
  const dy = ball.position.y - pocketPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy); // 计算球与袋口的距离
  return distance < POCKET_RADIUS; // 如果距离小于袋口半径，则发生碰撞
}

// 导出袋口位置数组
export const POCKETS = POCKET_POSITIONS;