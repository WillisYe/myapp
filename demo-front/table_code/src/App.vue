<script setup>
import { ref, onMounted, reactive } from 'vue'

// 游戏画布引用
const canvasRef = ref(null)

// 游戏配置
const tableWidth = 320
const tableHeight = 640
const ballRadius = 12
const friction = 0.98

// 游戏状态
const balls = reactive([
  { x: tableWidth / 2, y: tableHeight / 4, vx: 0, vy: 0, color: '#fff', pocketed: false }, // 白球
  { x: tableWidth / 2 - 30, y: tableHeight / 2, vx: 0, vy: 0, color: '#e33', pocketed: false }, // 红球
  { x: tableWidth / 2 + 30, y: tableHeight / 2, vx: 0, vy: 0, color: '#33e', pocketed: false }, // 蓝球
])

// 球杆状态
const cue = reactive({
  angle: -Math.PI/2,
  power: 0,
  dragging: false
})

// 袋口位置
const pockets = [
  { x: 0, y: 0 },
  { x: tableWidth, y: 0 },
  { x: 0, y: tableHeight },
  { x: tableWidth, y: tableHeight },
  { x: tableWidth/2, y: 0 },
  { x: tableWidth/2, y: tableHeight }
]

// 绘制函数
function drawTable(ctx) {
  ctx.fillStyle = '#228B22'
  ctx.fillRect(0, 0, tableWidth, tableHeight)

  // 绘制袋口
  pockets.forEach(p => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, ballRadius * 1.2, 0, Math.PI * 2)
    ctx.fillStyle = '#222'
    ctx.fill()
  })
}

function drawBalls(ctx) {
  balls.forEach(ball => {
    if (ball.pocketed) return
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = ball.color
    ctx.fill()
    ctx.strokeStyle = '#222'
    ctx.stroke()
  })
}

function drawCue(ctx) {
  if (isBallsMoving()) return
  const cueBall = balls[0]
  if (cueBall.pocketed) return

  ctx.save()
  ctx.strokeStyle = '#deb887'
  ctx.lineWidth = 6
  ctx.beginPath()
  const len = 80 + cue.power * 40
  ctx.moveTo(cueBall.x, cueBall.y)
  ctx.lineTo(
    cueBall.x + Math.cos(cue.angle) * -len,
    cueBall.y + Math.sin(cue.angle) * -len
  )
  ctx.stroke()
  ctx.restore()
}

// 物理更新
function isBallsMoving() {
  return balls.some(b => Math.abs(b.vx) > 0.1 || Math.abs(b.vy) > 0.1)
}

function updateBalls() {
  balls.forEach(ball => {
    if (ball.pocketed) return

    // 更新位置
    ball.x += ball.vx
    ball.y += ball.vy
    ball.vx *= friction
    ball.vy *= friction

    // 边界碰撞
    if (ball.x < ballRadius) { ball.x = ballRadius; ball.vx *= -0.8 }
    if (ball.x > tableWidth - ballRadius) { ball.x = tableWidth - ballRadius; ball.vx *= -0.8 }
    if (ball.y < ballRadius) { ball.y = ballRadius; ball.vy *= -0.8 }
    if (ball.y > tableHeight - ballRadius) { ball.y = tableHeight - ballRadius; ball.vy *= -0.8 }

    // 进袋检测
    pockets.forEach(p => {
      const dx = ball.x - p.x
      const dy = ball.y - p.y
      if (Math.sqrt(dx * dx + dy * dy) < ballRadius * 1.2) {
        ball.pocketed = true
      }
    })
  })

  // 球与球碰撞
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i], b = balls[j]
      if (a.pocketed || b.pocketed) continue

      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < ballRadius * 2) {
        const angle = Math.atan2(dy, dx)
        const targetX = a.x + Math.cos(angle) * ballRadius * 2
        const targetY = a.y + Math.sin(angle) * ballRadius * 2
        const ax = (targetX - b.x) * 0.5
        const ay = (targetY - b.y) * 0.5

        a.vx -= ax
        a.vy -= ay
        b.vx += ax
        b.vy += ay
      }
    }
  }
}

// 渲染循环
function render() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, tableWidth, tableHeight)

  drawTable(ctx)
  drawBalls(ctx)
  drawCue(ctx)
}

function gameLoop() {
  updateBalls()
  render()
  requestAnimationFrame(gameLoop)
}

// 触控事件处理
function getEventPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
  return { x, y }
}

function onTouchStart(e) {
  if (isBallsMoving()) return
  cue.dragging = true
  const { x, y } = getEventPos(e)
  const cueBall = balls[0]
  cue.angle = Math.atan2(cueBall.y - y, cueBall.x - x)
  cue.power = Math.min(Math.sqrt((cueBall.x-x)**2 + (cueBall.y-y)**2)/60, 1)
}

function onTouchMove(e) {
  if (!cue.dragging || isBallsMoving()) return
  const { x, y } = getEventPos(e)
  const cueBall = balls[0]
  cue.angle = Math.atan2(cueBall.y - y, cueBall.x - x)
  cue.power = Math.min(Math.sqrt((cueBall.x-x)**2 + (cueBall.y-y)**2)/60, 1)
}

function onTouchEnd(e) {
  if (!cue.dragging || isBallsMoving()) return
  cue.dragging = false
  const cueBall = balls[0]
  cueBall.vx += Math.cos(cue.angle) * cue.power * 12
  cueBall.vy += Math.sin(cue.angle) * cue.power * 12
  cue.power = 0
}

// 初始化
onMounted(() => {
  render()
  gameLoop()
})
</script>

<template>
  <div class="table-container">
    <canvas
      ref="canvasRef"
      :width="tableWidth"
      :height="tableHeight"
      class="table-canvas"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onTouchStart"
      @mousemove="onTouchMove"
      @mouseup="onTouchEnd"
    ></canvas>
    <div class="info-panel">
      <span v-if="balls.filter(b=>!b.pocketed).length===1">游戏结束！所有球已进袋</span>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #222;
}

.table-canvas {
  width: 96vw;
  max-width: 400px;
  height: 80vh;
  max-height: 700px;
  border-radius: 16px;
  box-shadow: 0 4px 24px #0008;
  background: #228B22;
  touch-action: none;
}

.info-panel {
  color: #fff;
  font-size: 1.2em;
  margin-top: 12px;
  text-align: center;
}
</style>
