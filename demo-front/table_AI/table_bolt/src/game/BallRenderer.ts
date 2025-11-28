import Matter from 'matter-js';

/**
 * 在球体上绘制编号
 * @param ball - Matter.js 的物理引擎中的球体对象
 * @param number - 要绘制在球上的编号
 */
export function drawBallNumber(ball: Matter.Body, number: number, BALL_RADIUS: number) {
  const ballBaseInfo = {
    "balls": {
      "0": { "name": "白球", "hex": "#FFFFFF", "rgb": [255, 255, 255] },
      "1": { "name": "黄球", "hex": "#FFD700", "rgb": [255, 215, 0] },
      "2": { "name": "蓝球", "hex": "#0000FF", "rgb": [0, 0, 255] },
      "3": { "name": "红球", "hex": "#FF0000", "rgb": [255, 0, 0] },
      "4": { "name": "紫球", "hex": "#800080", "rgb": [128, 0, 128] },
      "5": { "name": "橙球", "hex": "#FFA500", "rgb": [255, 165, 0] },
      "6": { "name": "绿球", "hex": "#008000", "rgb": [0, 128, 0] },
      "7": { "name": "褐球", "hex": "#8B4513", "rgb": [139, 69, 19] },
      "8": { "name": "黑球", "hex": "#000000", "rgb": [0, 0, 0] },
      "9": { "name": "黄白球", "hex": { "base": "#FFD700", "stripe": "#FFFFFF" }, "rgb": { "base": [255, 215, 0], "stripe": [255, 255, 255] } },
      "10": { "name": "蓝白球", "hex": { "base": "#0000FF", "stripe": "#FFFFFF" }, "rgb": { "base": [0, 0, 255], "stripe": [255, 255, 255] } },
      "11": { "name": "红白球", "hex": { "base": "#FF0000", "stripe": "#FFFFFF" }, "rgb": { "base": [255, 0, 0], "stripe": [255, 255, 255] } },
      "12": { "name": "紫白球", "hex": { "base": "#800080", "stripe": "#FFFFFF" }, "rgb": { "base": [128, 0, 128], "stripe": [255, 255, 255] } },
      "13": { "name": "橙白球", "hex": { "base": "#FFA500", "stripe": "#FFFFFF" }, "rgb": { "base": [255, 165, 0], "stripe": [255, 255, 255] } },
      "14": { "name": "绿白球", "hex": { "base": "#008000", "stripe": "#FFFFFF" }, "rgb": { "base": [0, 128, 0], "stripe": [255, 255, 255] } },
      "15": { "name": "褐白球", "hex": { "base": "#8B4513", "stripe": "#FFFFFF" }, "rgb": { "base": [139, 69, 19], "stripe": [255, 255, 255] } }
    },
    "types": {
      "solid": [1, 2, 3, 4, 5, 6, 7],
      "stripe": [9, 10, 11, 12, 13, 14, 15],
      "special": ["white", "8"]
    },
    "metadata": {
      "version": "1.0",
      "standard": "WPA",
      "description": "Standard 8-ball pool colors"
    }
  };

  // 将 number 转换为字符串，并检查是否存在对应的球信息
  const ballKey = number.toString();
  const validKeys = Object.keys(ballBaseInfo.balls) as Array<keyof typeof ballBaseInfo.balls>;
  if (!validKeys.includes(ballKey as keyof typeof ballBaseInfo.balls)) {
    return;
  }

  const ballInfo = ballBaseInfo.balls[ballKey as keyof typeof ballBaseInfo.balls];
  if (!ballInfo) {
    return;
  }

  // 使用可选链操作符和类型保护
  const baseColor = typeof ballInfo.hex === 'object' ? ballInfo.hex.base : ballInfo.hex;
  const stripeColor = (typeof ballInfo.hex === 'object' && ballInfo.hex.stripe) || '#fff';

  // 获取球的渲染属性
  const render = ball.render as any;

  // 移除默认的 sprite（如果有的话）
  render.sprite = undefined;

  const borderWidth = 3;

  // 定义自定义渲染逻辑
  render.custom = (ctx: CanvasRenderingContext2D, body: Matter.Body) => {
    // 绘制球体
    ctx.beginPath();
    ctx.arc(body.position.x, body.position.y, BALL_RADIUS - borderWidth, 0, 2 * Math.PI);
    ctx.fillStyle = stripeColor;
    ctx.fill();  // 填充球体
    ctx.strokeStyle = baseColor;  // 设置边框颜色为黑色
    ctx.lineWidth = borderWidth;  // 设置边框宽度
    ctx.stroke();  // 绘制边框

    // 绘制数字
    if (number) {
      ctx.fillStyle = '#000';  // 设置数字颜色为白色
      ctx.font = `${BALL_RADIUS}px Arial`;  // 设置字体和大小
      ctx.textAlign = 'center';  // 文字居中对齐
      ctx.textBaseline = 'middle';  // 文字垂直居中对齐
      ctx.fillText(number.toString(), body.position.x, body.position.y + 1);  // 在球体中心绘制编号
    }
  };
}