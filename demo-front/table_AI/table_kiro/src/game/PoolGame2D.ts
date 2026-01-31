import { EventEmitter } from './EventEmitter'
import { SoundManager } from './SoundManager'
import { EffectsManager2D } from './EffectsManager2D'
import type { GameState, Player } from '../types/game'

interface Vector2D {
  x: number
  y: number
}

interface Ball2D {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  type: 'cue' | 'solid' | 'stripe' | 'eight'
  pocketed: boolean
  predictedPath?: Vector2D[] // 预测轨迹
}

export class PoolGame2D extends EventEmitter<Record<string, (...args: any[]) => void>> {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private soundManager: SoundManager
  private effectsManager: EffectsManager2D

  // 游戏状态
  private gameState: GameState = 'waiting'
  private currentPlayer: Player = 'player1'
  private power = 0
  private isAiming = false

  // 游戏对象
  private balls: Ball2D[] = []
  private cueBall!: Ball2D
  private aimStart: Vector2D = { x: 0, y: 0 }
  private aimDirection: Vector2D = { x: 0, y: 0 }

  // 球杆
  private cueStick = {
    visible: false,
    x: 0,
    y: 0,
    angle: 0,
    length: 120,
    width: 6
  }

  // 轨迹预测
  private trajectoryPoints: Vector2D[] = []
  private targetBall: Ball2D | null = null

  // 桌子配置 - 移动端竖屏
  private config = {
    tableWidth: 300,   // 桌子宽度
    tableHeight: 600,  // 桌子高度（竖屏）
    ballRadius: 12,    // 球半径
    pocketRadius: 20,  // 球袋半径
    friction: 0.98,    // 摩擦系数
    restitution: 0.8,  // 弹性系数
    tableColor: '#006400',
    borderColor: '#8B4513',
    borderWidth: 20
  }

  // 球袋位置
  private pockets: Vector2D[] = []

  // 动画
  private animationId: number = 0
  private lastTime = 0

  constructor(canvas: HTMLCanvasElement) {
    super()
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法获取2D渲染上下文')
    this.ctx = ctx
    this.soundManager = new SoundManager()
    this.effectsManager = new EffectsManager2D()

    this.setupCanvas()
    this.setupPockets()
  }

  async init(): Promise<void> {
    this.emit('loadingProgress', 20)

    // 初始化音效
    await this.soundManager.init()
    this.emit('loadingProgress', 40)

    // 创建球
    this.createBalls()
    this.emit('loadingProgress', 80)

    // 开始游戏循环
    this.startGameLoop()
    this.emit('loadingProgress', 100)

    this.gameState = 'playing'
    this.emit('stateChange', this.gameState)
  }

  private setupCanvas(): void {
    // 设置画布尺寸适应移动端
    const updateCanvasSize = () => {
      const rect = this.canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      this.canvas.width = rect.width * dpr
      this.canvas.height = rect.height * dpr

      this.ctx.scale(dpr, dpr)
      this.canvas.style.width = rect.width + 'px'
      this.canvas.style.height = rect.height + 'px'
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
  }

  private setupPockets(): void {
    const { tableWidth, tableHeight, pocketRadius } = this.config
    const offsetX = (this.canvas.width / (window.devicePixelRatio || 1) - tableWidth) / 2
    const offsetY = (this.canvas.height / (window.devicePixelRatio || 1) - tableHeight) / 2

    // 6个球袋位置（竖屏布局）
    this.pockets = [
      { x: offsetX + pocketRadius, y: offsetY + pocketRadius }, // 左上
      { x: offsetX + tableWidth - pocketRadius, y: offsetY + pocketRadius }, // 右上
      { x: offsetX + pocketRadius, y: offsetY + tableHeight / 2 }, // 左中
      { x: offsetX + tableWidth - pocketRadius, y: offsetY + tableHeight / 2 }, // 右中
      { x: offsetX + pocketRadius, y: offsetY + tableHeight - pocketRadius }, // 左下
      { x: offsetX + tableWidth - pocketRadius, y: offsetY + tableHeight - pocketRadius } // 右下
    ]
  }

  private createBalls(): void {
    const { tableWidth, tableHeight, ballRadius } = this.config
    const offsetX = (this.canvas.width / (window.devicePixelRatio || 1) - tableWidth) / 2
    const offsetY = (this.canvas.height / (window.devicePixelRatio || 1) - tableHeight) / 2

    // 球的颜色
    const ballColors = [
      '#FFFFFF', // 0: 白球
      '#FFFF00', // 1: 黄色
      '#0000FF', // 2: 蓝色
      '#FF0000', // 3: 红色
      '#800080', // 4: 紫色
      '#FFA500', // 5: 橙色
      '#008000', // 6: 绿色
      '#800000', // 7: 栗色
      '#000000', // 8: 黑色
      '#FFFF00', // 9: 黄色条纹
      '#0000FF', // 10: 蓝色条纹
      '#FF0000', // 11: 红色条纹
      '#800080', // 12: 紫色条纹
      '#FFA500', // 13: 橙色条纹
      '#008000', // 14: 绿色条纹
      '#800000'  // 15: 栗色条纹
    ]

    this.balls = []

    // 白球位置（下方）
    const cueBallX = offsetX + tableWidth / 2
    const cueBallY = offsetY + tableHeight - 100

    this.cueBall = {
      id: 0,
      x: cueBallX,
      y: cueBallY,
      vx: 0,
      vy: 0,
      radius: ballRadius,
      color: ballColors[0],
      type: 'cue',
      pocketed: false
    }
    this.balls.push(this.cueBall)

    // 其他球三角形排列（上方）
    const startX = offsetX + tableWidth / 2
    const startY = offsetY + 150
    const spacing = ballRadius * 2.2

    let ballIndex = 1
    const rows = [1, 2, 3, 4, 5]

    rows.forEach((ballsInRow, rowIndex) => {
      const rowY = startY + rowIndex * spacing * 0.866
      const rowStartX = startX - (ballsInRow - 1) * spacing / 2

      for (let i = 0; i < ballsInRow; i++) {
        const ball: Ball2D = {
          id: ballIndex,
          x: rowStartX + i * spacing,
          y: rowY,
          vx: 0,
          vy: 0,
          radius: ballRadius,
          color: ballColors[ballIndex],
          type: ballIndex === 8 ? 'eight' : ballIndex < 8 ? 'solid' : 'stripe',
          pocketed: false
        }
        this.balls.push(ball)
        ballIndex++
      }
    })
  }

  private startGameLoop(): void {
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime
      this.lastTime = currentTime

      if (this.gameState === 'playing') {
        this.updatePhysics(deltaTime)
        this.checkCollisions()
        this.checkPockets()
      }

      this.effectsManager.update(deltaTime)
      this.render()
      this.animationId = requestAnimationFrame(gameLoop)
    }

    this.animationId = requestAnimationFrame(gameLoop)
  }

  private updatePhysics(deltaTime: number): void {
    this.balls.forEach(ball => {
      if (ball.pocketed) return

      // 更新位置
      ball.x += ball.vx * deltaTime * 0.1
      ball.y += ball.vy * deltaTime * 0.1

      // 应用摩擦力
      ball.vx *= this.config.friction
      ball.vy *= this.config.friction

      // 停止微小运动
      if (Math.abs(ball.vx) < 0.1) ball.vx = 0
      if (Math.abs(ball.vy) < 0.1) ball.vy = 0

      // 边界碰撞
      this.checkWallCollisions(ball)
    })
  }

  private checkWallCollisions(ball: Ball2D): void {
    const { tableWidth, tableHeight, borderWidth } = this.config
    const offsetX = (this.canvas.width / (window.devicePixelRatio || 1) - tableWidth) / 2
    const offsetY = (this.canvas.height / (window.devicePixelRatio || 1) - tableHeight) / 2

    const minX = offsetX + borderWidth + ball.radius
    const maxX = offsetX + tableWidth - borderWidth - ball.radius
    const minY = offsetY + borderWidth + ball.radius
    const maxY = offsetY + tableHeight - borderWidth - ball.radius

    if (ball.x <= minX) {
      ball.x = minX
      ball.vx = -ball.vx * this.config.restitution
      this.soundManager.playBorderBounceSound(Math.abs(ball.vx) / 10)
    }
    if (ball.x >= maxX) {
      ball.x = maxX
      ball.vx = -ball.vx * this.config.restitution
      this.soundManager.playBorderBounceSound(Math.abs(ball.vx) / 10)
    }
    if (ball.y <= minY) {
      ball.y = minY
      ball.vy = -ball.vy * this.config.restitution
      this.soundManager.playBorderBounceSound(Math.abs(ball.vy) / 10)
    }
    if (ball.y >= maxY) {
      ball.y = maxY
      ball.vy = -ball.vy * this.config.restitution
      this.soundManager.playBorderBounceSound(Math.abs(ball.vy) / 10)
    }
  }

  private checkCollisions(): void {
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const ball1 = this.balls[i]
        const ball2 = this.balls[j]

        if (ball1.pocketed || ball2.pocketed) continue

        const dx = ball2.x - ball1.x
        const dy = ball2.y - ball1.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < ball1.radius + ball2.radius) {
          // 碰撞处理
          const angle = Math.atan2(dy, dx)
          const sin = Math.sin(angle)
          const cos = Math.cos(angle)

          // 旋转速度向量
          const vx1 = ball1.vx * cos + ball1.vy * sin
          const vy1 = ball1.vy * cos - ball1.vx * sin
          const vx2 = ball2.vx * cos + ball2.vy * sin
          const vy2 = ball2.vy * cos - ball2.vx * sin

          // 一维弹性碰撞
          const newVx1 = vx2
          const newVx2 = vx1

          // 旋转回原坐标系
          ball1.vx = newVx1 * cos - vy1 * sin
          ball1.vy = vy1 * cos + newVx1 * sin
          ball2.vx = newVx2 * cos - vy2 * sin
          ball2.vy = vy2 * cos + newVx2 * sin

          // 分离球体
          const overlap = ball1.radius + ball2.radius - distance
          const separationX = (dx / distance) * overlap * 0.5
          const separationY = (dy / distance) * overlap * 0.5

          ball1.x -= separationX
          ball1.y -= separationY
          ball2.x += separationX
          ball2.y += separationY

          // 播放碰撞音效
          const intensity = Math.sqrt(newVx1 * newVx1 + vy1 * vy1) / 20
          this.soundManager.playBallCollisionSound(Math.min(intensity, 1))

          // 碰撞特效
          this.effectsManager.createCollisionEffect(
            (ball1.x + ball2.x) / 2,
            (ball1.y + ball2.y) / 2,
            Math.min(intensity, 1)
          )
        }
      }
    }
  }

  private checkPockets(): void {
    this.balls.forEach(ball => {
      if (ball.pocketed) return

      this.pockets.forEach(pocket => {
        const dx = ball.x - pocket.x
        const dy = ball.y - pocket.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.config.pocketRadius) {
          ball.pocketed = true
          ball.vx = 0
          ball.vy = 0

          // 播放进球音效
          this.soundManager.playPocketSound()

          // 进球特效
          this.effectsManager.createPocketEffect(ball.x, ball.y)

          // 触发进球事件
          this.emit('ballPocketed', {
            id: ball.id,
            type: ball.type,
            color: ball.color,
            position: { x: ball.x, y: ball.y, z: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            pocketed: true
          })
        }
      })
    })
  }

  private updateCueStick(): void {
    if (!this.isAiming || this.cueBall.pocketed) return

    // 球杆距离白球边缘的距离（在运动方向的相反方向）
    const baseDistance = this.cueBall.radius + 10 // 白球半径 + 10px间隙
    const powerDistance = (this.power / 100) * 30 // 根据力度调整距离
    const totalDistance = baseDistance + powerDistance

    // 计算球杆尖端位置（在瞄准方向的相反方向，即白球后面）
    const tipX = this.cueBall.x - this.aimDirection.x * totalDistance
    const tipY = this.cueBall.y - this.aimDirection.y * totalDistance

    // 球杆中心位置（球杆尖端向后偏移半个球杆长度）
    this.cueStick.x = tipX - this.aimDirection.x * (this.cueStick.length / 2)
    this.cueStick.y = tipY - this.aimDirection.y * (this.cueStick.length / 2)

    // 计算球杆角度（指向白球）
    this.cueStick.angle = Math.atan2(this.aimDirection.y, this.aimDirection.x)
  }

  private calculateTrajectory(): void {
    if (!this.isAiming || this.cueBall.pocketed) return

    this.trajectoryPoints = []
    this.targetBall = null

    const force = this.power * 0.3
    const startVx = this.aimDirection.x * force
    const startVy = this.aimDirection.y * force

    // 模拟白球轨迹
    const cueBallTrajectory = this.simulateBallPath(
      this.cueBall.x,
      this.cueBall.y,
      startVx,
      startVy,
      50 // 最大步数
    )

    this.trajectoryPoints = cueBallTrajectory.points

    // 检查是否会碰撞到其他球
    const collision = this.findFirstCollision(cueBallTrajectory.points)
    if (collision) {
      this.targetBall = collision.ball

      // 计算碰撞后的轨迹
      const collisionResult = this.calculateCollisionResult(
        cueBallTrajectory.velocity,
        collision
      )

      // 添加碰撞后的轨迹点
      if (collisionResult) {
        // 白球碰撞后的轨迹
        const cueBallAfterCollision = this.simulateBallPath(
          collision.point.x,
          collision.point.y,
          collisionResult.cueBallVx,
          collisionResult.cueBallVy,
          30
        )

        // 目标球的轨迹
        const targetBallTrajectory = this.simulateBallPath(
          collision.point.x,
          collision.point.y,
          collisionResult.targetBallVx,
          collisionResult.targetBallVy,
          30
        )

        // 存储碰撞后的轨迹
        this.trajectoryPoints = [
          ...this.trajectoryPoints.slice(0, collision.index),
          ...cueBallAfterCollision.points
        ]

        // 存储目标球轨迹（用于渲染）
        collision.ball.predictedPath = targetBallTrajectory.points
      }
    }
  }

  private simulateBallPath(
    startX: number,
    startY: number,
    startVx: number,
    startVy: number,
    maxSteps: number
  ): { points: Vector2D[]; velocity: Vector2D } {
    const points: Vector2D[] = []
    let x = startX
    let y = startY
    let vx = startVx
    let vy = startVy

    const { tableWidth, tableHeight, borderWidth } = this.config
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1)
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1)
    const offsetX = (canvasWidth - tableWidth) / 2
    const offsetY = (canvasHeight - tableHeight) / 2

    const minX = offsetX + borderWidth + this.config.ballRadius
    const maxX = offsetX + tableWidth - borderWidth - this.config.ballRadius
    const minY = offsetY + borderWidth + this.config.ballRadius
    const maxY = offsetY + tableHeight - borderWidth - this.config.ballRadius

    for (let i = 0; i < maxSteps; i++) {
      // 检查边界碰撞
      if (x <= minX || x >= maxX) {
        vx = -vx * this.config.restitution
        x = x <= minX ? minX : maxX
      }
      if (y <= minY || y >= maxY) {
        vy = -vy * this.config.restitution
        y = y <= minY ? minY : maxY
      }

      // 更新位置
      x += vx * 2
      y += vy * 2

      // 应用摩擦力
      vx *= this.config.friction
      vy *= this.config.friction

      // 如果速度太小就停止
      if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) break

      points.push({ x, y })
    }

    return { points, velocity: { x: vx, y: vy } }
  }

  private findFirstCollision(points: Vector2D[]): {
    ball: Ball2D
    point: Vector2D
    index: number
  } | null {
    for (let i = 0; i < points.length; i++) {
      const point = points[i]

      for (const ball of this.balls) {
        if (ball.id === 0 || ball.pocketed) continue // 跳过白球和已进袋的球

        const dx = point.x - ball.x
        const dy = point.y - ball.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= this.config.ballRadius * 2) {
          return { ball, point, index: i }
        }
      }
    }

    return null
  }

  private calculateCollisionResult(
    cueBallVelocity: Vector2D,
    collision: { ball: Ball2D; point: Vector2D }
  ): {
    cueBallVx: number
    cueBallVy: number
    targetBallVx: number
    targetBallVy: number
  } | null {
    const dx = collision.point.x - collision.ball.x
    const dy = collision.point.y - collision.ball.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) return null

    // 碰撞角度
    const angle = Math.atan2(dy, dx)
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)

    // 旋转速度向量到碰撞坐标系
    const vx1 = cueBallVelocity.x * cos + cueBallVelocity.y * sin
    const vy1 = cueBallVelocity.y * cos - cueBallVelocity.x * sin

    // 一维弹性碰撞（假设目标球静止）
    const newVx1 = 0 // 白球在碰撞方向上的速度变为0
    const newVx2 = vx1 // 目标球获得白球的速度

    // 旋转回原坐标系
    const cueBallVx = newVx1 * cos - vy1 * sin
    const cueBallVy = vy1 * cos + newVx1 * sin
    const targetBallVx = newVx2 * cos
    const targetBallVy = newVx2 * sin

    return {
      cueBallVx: cueBallVx * 0.8, // 减少一些能量损失
      cueBallVy: cueBallVy * 0.8,
      targetBallVx: targetBallVx * 0.9,
      targetBallVy: targetBallVy * 0.9
    }
  }

  private render(): void {
    const ctx = this.ctx
    const { tableWidth, tableHeight, borderWidth } = this.config
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1)
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1)
    const offsetX = (canvasWidth - tableWidth) / 2
    const offsetY = (canvasHeight - tableHeight) / 2

    // 清空画布
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 绘制桌子边框
    ctx.fillStyle = this.config.borderColor
    ctx.fillRect(offsetX, offsetY, tableWidth, tableHeight)

    // 绘制桌面
    ctx.fillStyle = this.config.tableColor
    ctx.fillRect(
      offsetX + borderWidth,
      offsetY + borderWidth,
      tableWidth - borderWidth * 2,
      tableHeight - borderWidth * 2
    )

    // 绘制球袋
    ctx.fillStyle = '#000000'
    this.pockets.forEach(pocket => {
      ctx.beginPath()
      ctx.arc(pocket.x, pocket.y, this.config.pocketRadius, 0, Math.PI * 2)
      ctx.fill()
    })

    // 绘制球
    this.balls.forEach(ball => {
      if (ball.pocketed) return

      // 球的阴影
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.arc(ball.x + 2, ball.y + 2, ball.radius, 0, Math.PI * 2)
      ctx.fill()

      // 球体
      ctx.fillStyle = ball.color
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()

      // 球的边框
      ctx.strokeStyle = '#333333'
      ctx.lineWidth = 1
      ctx.stroke()

      // 球号
      if (ball.id > 0) {
        ctx.fillStyle = ball.color === '#000000' || ball.color === '#800000' ? '#FFFFFF' : '#000000'
        ctx.font = `${ball.radius}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(ball.id.toString(), ball.x, ball.y)
      }

      // 高光效果
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.beginPath()
      ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.3, 0, Math.PI * 2)
      ctx.fill()
    })

    // 绘制特效
    this.effectsManager.render(this.ctx)

    // 绘制轨迹预测线
    if (this.isAiming && !this.cueBall.pocketed) {
      this.drawTrajectoryPrediction()
    }

    // 绘制球杆
    if (this.cueStick.visible && !this.cueBall.pocketed) {
      this.drawCueStick()
    }

    // 绘制瞄准线
    if (this.isAiming && !this.cueBall.pocketed) {
      this.drawAimLine()
    }
  }

  private drawAimLine(): void {
    const ctx = this.ctx
    const lineLength = this.power * 3

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    ctx.beginPath()
    ctx.moveTo(this.cueBall.x, this.cueBall.y)
    ctx.lineTo(
      this.cueBall.x + this.aimDirection.x * lineLength,
      this.cueBall.y + this.aimDirection.y * lineLength
    )
    ctx.stroke()
    ctx.setLineDash([])
  }

  private drawCueStick(): void {
    const ctx = this.ctx

    ctx.save()
    ctx.translate(this.cueStick.x, this.cueStick.y)
    ctx.rotate(this.cueStick.angle)

    // 球杆主体（从中心向两端绘制）
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(-this.cueStick.length / 2, -this.cueStick.width / 2, this.cueStick.length, this.cueStick.width)

    // 球杆尖端（朝向白球的一端，深色）- 在球杆的右端（正X方向）
    ctx.fillStyle = '#654321'
    ctx.fillRect(this.cueStick.length / 2 - 20, -this.cueStick.width / 2, 20, this.cueStick.width)

    // 球杆握把（远离白球的一端，浅色）- 在球杆的左端（负X方向）
    ctx.fillStyle = '#A0522D'
    ctx.fillRect(-this.cueStick.length / 2, -this.cueStick.width / 2, 30, this.cueStick.width)

    // 球杆边框
    ctx.strokeStyle = '#654321'
    ctx.lineWidth = 1
    ctx.strokeRect(-this.cueStick.length / 2, -this.cueStick.width / 2, this.cueStick.length, this.cueStick.width)

    ctx.restore()
  }

  private drawTrajectoryPrediction(): void {
    const ctx = this.ctx

    // 绘制白球轨迹
    if (this.trajectoryPoints.length > 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])

      ctx.beginPath()
      ctx.moveTo(this.cueBall.x, this.cueBall.y)

      for (let i = 0; i < this.trajectoryPoints.length; i++) {
        const point = this.trajectoryPoints[i]
        const alpha = 1 - (i / this.trajectoryPoints.length) * 0.5 // 渐变透明度

        ctx.globalAlpha = alpha
        ctx.lineTo(point.x, point.y)
      }

      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1
    }

    // 绘制目标球轨迹
    if (this.targetBall && (this.targetBall as any).predictedPath) {
      const targetPath = (this.targetBall as any).predictedPath as Vector2D[]

      if (targetPath.length > 1) {
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)' // 橙色轨迹
        ctx.lineWidth = 2
        ctx.setLineDash([6, 6])

        ctx.beginPath()
        ctx.moveTo(this.targetBall.x, this.targetBall.y)

        for (let i = 0; i < targetPath.length; i++) {
          const point = targetPath[i]
          const alpha = 1 - (i / targetPath.length) * 0.5

          ctx.globalAlpha = alpha
          ctx.lineTo(point.x, point.y)
        }

        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }
    }

    // 绘制碰撞点标记
    if (this.targetBall) {
      const collision = this.findFirstCollision(this.trajectoryPoints)
      if (collision) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'
        ctx.beginPath()
        ctx.arc(collision.point.x, collision.point.y, 4, 0, Math.PI * 2)
        ctx.fill()

        // 碰撞点周围的光环
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(collision.point.x, collision.point.y, 8, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  // 交互处理
  handlePointerStart(x: number, y: number): void {
    if (this.gameState !== 'playing' || this.cueBall.pocketed) return

    const rect = this.canvas.getBoundingClientRect()
    const canvasX = x - rect.left
    const canvasY = y - rect.top

    // 检查是否点击了白球
    const dx = canvasX - this.cueBall.x
    const dy = canvasY - this.cueBall.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= this.cueBall.radius + 20) { // 增加点击范围
      this.isAiming = true
      this.aimStart = { x: canvasX, y: canvasY }
      this.cueStick.visible = true
    }
  }

  handlePointerMove(x: number, y: number): void {
    if (!this.isAiming) return

    const rect = this.canvas.getBoundingClientRect()
    const canvasX = x - rect.left
    const canvasY = y - rect.top

    const dx = canvasX - this.aimStart.x
    const dy = canvasY - this.aimStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // 计算瞄准方向
    if (distance > 0) {
      this.aimDirection.x = dx / distance
      this.aimDirection.y = dy / distance
    }

    // 更新力度
    this.power = Math.min(distance / 2, 100)

    // 更新球杆位置
    this.updateCueStick()

    // 计算轨迹预测
    this.calculateTrajectory()
  }

  handlePointerEnd(): void {
    if (!this.isAiming) return

    this.isAiming = false
    this.cueStick.visible = false
    this.trajectoryPoints = []
    this.targetBall = null

    if (this.power > 5) {
      this.shootCueBall()
    }

    this.power = 0
  }

  private shootCueBall(): void {
    const force = this.power * 0.3

    this.cueBall.vx = this.aimDirection.x * force
    this.cueBall.vy = this.aimDirection.y * force

    // 播放击球音效
    this.soundManager.playHitSound(this.power / 100)

    // 击球特效
    this.effectsManager.createHitEffect(this.cueBall.x, this.cueBall.y)
  }

  // 公共方法
  handleResize(): void {
    this.setupCanvas()
    this.setupPockets()
  }

  setPower(power: number): void {
    this.power = power
  }

  togglePause(): void {
    this.gameState = this.gameState === 'paused' ? 'playing' : 'paused'
    this.emit('stateChange', this.gameState)
  }

  restart(): void {
    this.gameState = 'playing'
    this.currentPlayer = 'player1'
    this.power = 0
    this.isAiming = false
    this.cueStick.visible = false
    this.trajectoryPoints = []
    this.targetBall = null

    // 重新创建球
    this.createBalls()

    this.emit('stateChange', this.gameState)
    this.emit('playerChange', this.currentPlayer)
  }

  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.soundManager.dispose()
    this.effectsManager.dispose()
  }
}