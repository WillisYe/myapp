import type { TableDimensions } from './types';

export class PowerBar {
  // 私有属性
  private power: number = 0; // 当前力量值
  private maxPower: number = 10; // 最大力量值
  private isAdjusting: boolean = false; // 是否正在调整力量
  private startY: number = 0; // 鼠标按下时的初始Y坐标
  private barRect = { x: 720, y: 100, width: 30, height: 200 }; // 力量条矩形区域

  constructor({ tableWidth, tableHeight, wallWidth, powerbarWidth, powerbarGapleft }: TableDimensions) {
    this.barRect = {
      x: tableWidth + powerbarGapleft,
      y: 0,
      width: powerbarWidth - 1,
      height: tableHeight - 1
    };
  }

  // 绘制力量条
  draw(ctx: CanvasRenderingContext2D) {
    // 绘制背景（半透明黑色）
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(this.barRect.x, this.barRect.y, this.barRect.width, this.barRect.height);

    // 计算并绘制当前力量高度
    const powerHeight = (this.power / this.maxPower) * this.barRect.height;
    ctx.fillStyle = `rgb(${(this.power / this.maxPower) * 255}, ${255 - (this.power / this.maxPower) * 255}, 0)`; // 根据力量值设置颜色
    ctx.fillRect(this.barRect.x, 0, this.barRect.width, powerHeight);
  }

  // 检测鼠标是否在力量条区域内
  isInPowerBar(x: number, y: number): boolean {
    return x >= this.barRect.x && x <= this.barRect.x + this.barRect.width &&
      y >= this.barRect.y && y <= this.barRect.y + this.barRect.height;
  }

  // 开始调整力量
  startAdjusting(y: number) {
    this.isAdjusting = true;
    this.startY = y; // 记录鼠标按下时的Y坐标
  }

  // 调整力量值
  adjustPower(y: number) {
    // if (!this.isAdjusting) return;

    // 计算鼠标移动的距离，并根据距离调整力量值
    const deltaY = y - this.barRect.y;
    const height = this.barRect.height;
    this.power = Math.max(0, Math.min(this.maxPower, deltaY / height * this.maxPower));
  }

  // 停止调整力量
  stopAdjusting() {
    this.isAdjusting = false;
  }

  // 获取当前力量值
  getPower(): number {
    return this.power;
  }

  // 重置力量条状态
  reset() {
    this.power = 0;
    this.isAdjusting = false;
  }
}