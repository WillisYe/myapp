import Matter from 'matter-js'
import type { TableDimensions, TableDimension, Ball } from './types'

export const POCKET_POSITIONS = [
  { x: 20, y: 20 }, // Left top
  { x: 400, y: 10 }, // Center top
  { x: 780, y: 20 }, // Right top
  { x: 20, y: 580 }, // Left bottom
  { x: 400, y: 590 }, // Center bottom
  { x: 780, y: 580 }, // Right bottom
]

export function createPockets(
  engine: Matter.Engine,
  { pocketRadius, POCKET_POSITIONS, tableWidth, tableHeight }: TableDimensions
) {
  const POCKET_RADIUS = pocketRadius
  const pockets = POCKET_POSITIONS.map(pos => {
    // 定义半圆的顶点
    const semiCircleVertices = (
      radius: number,
      segments: number,
      posx: number,
      posy: number
    ): Array<{ x: number; y: number }> => {
      var flag = posy > tableHeight / 2 ? 1 : -1
      const vertices: Array<{ x: number; y: number }> = []
      for (let i = 0; i <= segments; i++) {
        var offset = 0
        switch (true) {
          case posx < tableWidth / 2 && posy < tableHeight / 2:
            offset = segments / 4
            break
          case posx < tableWidth / 2 && posy > tableHeight / 2:
            offset = segments / 4
            break
          case posx > tableWidth / 2 && posy < tableHeight / 2:
            offset = -segments / 4
            break
          case posx > tableWidth / 2 && posy > tableHeight / 2:
            offset = -segments / 4
            break
          case posx < tableWidth / 2 && posy == tableHeight / 2:
            offset = segments / 2
            break
          case posx > tableWidth / 2 && posy == tableHeight / 2:
            offset = -segments / 2
            break
          default:
            break
        }

        const angle = (Math.PI * flag * (i + offset)) / segments
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)
        vertices.push({ x, y })
      }
      vertices.push({ x: 0, y: 0 }) // 添加中心点
      return vertices
    }

    // 创建半圆
    var pocket = Matter.Bodies.fromVertices(
      pos.x,
      pos.y,
      [semiCircleVertices(POCKET_RADIUS, 30, pos.x, pos.y)],
      {
        isStatic: true,
        isSensor: true,
        render: {
          fillStyle: '#14151f',
          strokeStyle: '#ffffff',
          lineWidth: 1,
        },
      }
    );
    (pocket as any).pocket = true
    return pocket
  })

  Matter.Composite.add(engine.world, pockets)
  
  return pockets
}

export function checkPocketCollision(
  ball: Matter.Body,
  pocketPos: { x: number; y: number },
  pocketRadius: number
): boolean {
  const dx = ball.position.x - pocketPos.x
  const dy = ball.position.y - pocketPos.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Check if ball is moving slowly enough to be pocketed
  const velocity = Math.sqrt(
    ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y
  )

  var result = distance < pocketRadius + 15 && velocity < 15
  return result
}

export function handleBallPocketed(ball: Ball, engine: Matter.Engine, whitePosition: { x: number; y: number }) {
  if (ball.body.world) {
    Matter.Composite.remove(engine.world, ball.body)
  }
  ball.pocketed = true

  // Reset white ball if pocketed
  if (ball.type === 'white') {
    setTimeout(() => {
      ball.pocketed = false
      Matter.Body.setPosition(ball.body, { x: whitePosition.x, y: whitePosition.y })
      Matter.Body.setVelocity(ball.body, { x: 0, y: 0 })
      Matter.Body.setAngularVelocity(ball.body, 0)
      Matter.Composite.add(engine.world, ball.body)
    }, 1000) // Add delay before respawning white ball
  }
}
