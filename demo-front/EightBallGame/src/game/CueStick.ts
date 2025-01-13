import Matter from 'matter-js';
import type { TableDimensions, Ball } from './types';
import { PowerBar } from './PowerBar';
import { AimingSystem } from './AimingSystem';
import AlloyFinger from 'alloyfinger';
import { isInTable } from './TableManager';

export class CueStick {
  // 私有属性
  private angle: number = 0; // 球杆角度
  private isAiming: boolean = false; // 是否正在瞄准
  private directionConfirmed: boolean = false; // 方向是否已确认
  private powerBar: PowerBar; // 力量条对象
  private targetBall: { ball: Ball; intersection: Matter.Vector } | null = null; // 目标球及交点
  private walls; // 球杆角度

  // 构造函数
  constructor(
    private render: Matter.Render, // 渲染器
    private balls: Ball[], // 球列表
    private walls: Matter.Body[], // 球列表
    private engine: Matter.Engine, // 物理引擎
    private gameOptions: TableDimensions, // 物理引擎
  ) {
    this.walls = walls;
    this.gameOptions = gameOptions;
    this.powerBar = new PowerBar(gameOptions); // 初始化力量条
    this.setupMouseControls(); // 设置鼠标控制
  }

  // 设置鼠标控制事件监听器
  private setupMouseControls() {
    const canvas = this.render.canvas;
    this.startAiming(-Math.PI / 2)

    new AlloyFinger(canvas, {
      touchStart: () => { },
      touchMove: (evt) => {
        var e = evt.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.powerBar.isInPowerBar(x, y)) {
          this.powerBar.adjustPower(y); // 调整力量
        }
        if (isInTable(x, y, this.gameOptions)) {
          this.isAiming = true;
          const whiteBall = this.balls.find(ball => ball.type === 'white' && !ball.pocketed);
          if (whiteBall) {
            const dx = x - whiteBall.body.position.x;
            const dy = y - whiteBall.body.position.y;
            this.angle = Math.atan2(dy, dx); // 计算角度

            // 更新目标球
            this.targetBall = AimingSystem.findTargetBall(whiteBall, this.angle, this.balls);
          }
        }
      },
      touchEnd: (evt) => {
        var e = evt.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.powerBar.isInPowerBar(x, y)) {
          if (this.powerBar.getPower() > 0) {
            const whiteBall = this.balls.find(ball => ball.type === 'white' && !ball.pocketed);
            if (whiteBall) {
              this.strike(whiteBall); // 击打白球
            }
            this.resetState(); // 重置状态
          }

          this.powerBar.stopAdjusting(); // 停止调整力量条
        }
        if (isInTable(x, y, this.gameOptions)) {
          this.isAiming = false;
        }
      },
      touchCancel: () => { },
      multipointStart: () => { },
      multipointEnd: () => { },
      tap: () => { },
      doubleTap: () => { },
      longTap: () => { },
      singleTap: () => { },
      rotate: (evt) => {
      },
      pinch: (evt) => {
      },
      pressMove: (evt) => {
      },
      swipe: (evt) => {
      }
    });

    return
    // 鼠标按下事件
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!this.isAiming && !this.directionConfirmed) {
        this.startAiming(0); // 开始瞄准
      } else if (this.directionConfirmed && this.powerBar.isInPowerBar(x, y)) {
        this.powerBar.startAdjusting(y); // 开始调整力量条
      }
    });

    // 鼠标移动事件
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.isAiming && !this.directionConfirmed) {
        const whiteBall = this.balls.find(ball => ball.type === 'white' && !ball.pocketed);
        if (whiteBall) {
          const dx = x - whiteBall.body.position.x;
          const dy = y - whiteBall.body.position.y;
          this.angle = Math.atan2(dy, dx); // 计算角度

          // 更新目标球
          this.targetBall = AimingSystem.findTargetBall(whiteBall, this.angle, this.balls);
        }
      } else if (this.directionConfirmed && this.powerBar.isInPowerBar(x, y)) {
        this.powerBar.adjustPower(y); // 调整力量
      }
    });

    // 鼠标释放事件
    canvas.addEventListener('mouseup', () => {
      if (this.isAiming && !this.directionConfirmed) {
        this.directionConfirmed = true; // 确认方向
      } else if (this.directionConfirmed && this.powerBar.getPower() > 0) {
        const whiteBall = this.balls.find(ball => ball.type === 'white' && !ball.pocketed);
        if (whiteBall) {
          this.strike(whiteBall); // 击打白球
        }
        this.resetState(); // 重置状态
      }
      this.powerBar.stopAdjusting(); // 停止调整力量条
    });
  }

  // 重置球杆状态
  private resetState() {
    this.isAiming = false;
    this.directionConfirmed = false;
    this.powerBar.reset();
    this.targetBall = null;
  }

  // 绘制球杆和相关元素
  draw(whiteBall: Ball) {
    if (!this.isAiming || whiteBall.pocketed) return;
    const ctx = this.render.context;
    if (!ctx) return;

    // 绘制瞄准系统
    AimingSystem.draw(
      ctx,
      whiteBall,
      this.targetBall,
      this.angle,
      this.powerBar.getPower(),
      this.gameOptions,
    );

    // 绘制球杆
    ctx.beginPath();
    const stickStartX = whiteBall.body.position.x - Math.cos(this.angle) * (100 + this.powerBar.getPower() * 2);
    const stickStartY = whiteBall.body.position.y - Math.sin(this.angle) * (100 + this.powerBar.getPower() * 2);
    const stickEndX = whiteBall.body.position.x - Math.cos(this.angle) * 20;
    const stickEndY = whiteBall.body.position.y - Math.sin(this.angle) * 20;

    ctx.moveTo(stickStartX, stickStartY);
    ctx.lineTo(stickEndX, stickEndY);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#8B4513'; // 棕色
    ctx.stroke();
    ctx.lineWidth = 1;

    // 绘制力量条
    this.powerBar.draw(ctx);
  }

  // 开始瞄准
  startAiming(angle: number) {
    if (this.isAiming) {
      // return
    }
    this.isAiming = true;
    this.angle = angle;
    this.directionConfirmed = false;
  }

  // 击打白球
  strike(whiteBall: Ball): number {
    if (!this.isAiming) return 0;

    const force = this.powerBar.getPower() * 0.02;
    Matter.Body.applyForce(whiteBall.body, whiteBall.body.position, {
      x: Math.cos(this.angle) * force,
      y: Math.sin(this.angle) * force
    });

    const finalPower = this.powerBar.getPower();
    this.resetState();
    return finalPower;
  }

  // 返回是否正在瞄准
  isActive(): boolean {
    return this.isAiming;
  }
}