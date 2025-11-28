const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布大小为窗口大小
canvas.width = 800;
canvas.height = 400;

// 球类
class Ball {
    constructor(x, y, radius, color, number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.number = number;
        this.dx = 0;
        this.dy = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        
        if (this.number) {
            ctx.fillStyle = '#fff';
            ctx.font = `${this.radius * 0.6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.number.toString(), this.x, this.y);
        }
    }
}

// 游戏状态
const gameState = {
    balls: [], // 存储所有球
    cueBall: null, // 白球
    playerTurn: 1, // 玩家回合
    gameStarted: false // 游戏是否开始
};

// 初始化游戏
function initGame() {
    // 初始化球
    const ballRadius = 10;
    const startX = canvas.width * 0.7;
    const startY = canvas.height / 2;
    
    // 创建白球
    gameState.cueBall = new Ball(canvas.width / 4, canvas.height / 2, ballRadius, '#fff', null);
    
    // 创建三角形排列的15个球
    const colors = ['#ff0', '#f00', '#00f', '#800080', '#ff8c00', '#008000', '#800000', '#000'];
    let row = 0;
    let count = 0;
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j <= i; j++) {
            const x = startX + i * ballRadius * 2 * Math.cos(Math.PI / 6);
            const y = startY - (i * ballRadius) + j * ballRadius * 2;
            const color = colors[count % colors.length];
            gameState.balls.push(new Ball(x, y, ballRadius, color, count + 1));
            count++;
        }
    }
}

// 渲染游戏
function renderGame() {
    // 绘制桌球台
    ctx.fillStyle = '#0a5c36';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制球袋
    const pocketRadius = 15;
    const pockets = [
        {x: 0, y: 0},
        {x: canvas.width/2, y: 0},
        {x: canvas.width, y: 0},
        {x: 0, y: canvas.height},
        {x: canvas.width/2, y: canvas.height},
        {x: canvas.width, y: canvas.height}
    ];
    
    ctx.fillStyle = '#000';
    pockets.forEach(pocket => {
        ctx.beginPath();
        ctx.arc(pocket.x, pocket.y, pocketRadius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 绘制所有球
    gameState.balls.forEach(ball => ball.draw());
    gameState.cueBall.draw();
}

// 检测两个球是否碰撞
function checkCollision(ball1, ball2) {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < ball1.radius + ball2.radius;
}

// 处理两个球的碰撞
function handleCollision(ball1, ball2) {
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 计算碰撞法线
    const nx = dx / distance;
    const ny = dy / distance;
    
    // 计算相对速度
    const vx = ball2.dx - ball1.dx;
    const vy = ball2.dy - ball1.dy;
    
    // 计算相对速度在碰撞法线上的投影
    const velocityAlongNormal = vx * nx + vy * ny;
    
    // 如果球正在分离，不处理碰撞
    if (velocityAlongNormal > 0) return;
    
    // 计算冲量
    const restitution = 0.9; // 弹性系数
    const j = -(1 + restitution) * velocityAlongNormal;
    
    // 应用冲量
    const impulse = j / (1 / 1 + 1 / 1); // 假设质量都为1
    ball1.dx -= impulse * nx;
    ball1.dy -= impulse * ny;
    ball2.dx += impulse * nx;
    ball2.dy += impulse * ny;
}

// 更新游戏状态
function updateGame() {
    // 更新所有球的位置
    gameState.balls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // 边界检测
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.dx *= -0.8; // 反弹并损失部分能量
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -0.8; // 反弹并损失部分能量
        }
        
        // 摩擦力
        ball.dx *= 0.99;
        ball.dy *= 0.99;
        
        // 如果速度很小则停止
        if (Math.abs(ball.dx) < 0.1) ball.dx = 0;
        if (Math.abs(ball.dy) < 0.1) ball.dy = 0;
    });
    
    // 检测球与球之间的碰撞
    for (let i = 0; i < gameState.balls.length; i++) {
        for (let j = i + 1; j < gameState.balls.length; j++) {
            if (checkCollision(gameState.balls[i], gameState.balls[j])) {
                handleCollision(gameState.balls[i], gameState.balls[j]);
            }
        }
        // 检测与白球的碰撞
        if (checkCollision(gameState.balls[i], gameState.cueBall)) {
            handleCollision(gameState.balls[i], gameState.cueBall);
        }
    }
    
    // 更新白球位置
    gameState.cueBall.x += gameState.cueBall.dx;
    gameState.cueBall.y += gameState.cueBall.dy;
    
    // 白球边界检测
    if (gameState.cueBall.x - gameState.cueBall.radius < 0 || 
        gameState.cueBall.x + gameState.cueBall.radius > canvas.width) {
        gameState.cueBall.dx *= -0.8;
    }
    if (gameState.cueBall.y - gameState.cueBall.radius < 0 || 
        gameState.cueBall.y + gameState.cueBall.radius > canvas.height) {
        gameState.cueBall.dy *= -0.8;
    }
    
    // 白球摩擦力
    gameState.cueBall.dx *= 0.99;
    gameState.cueBall.dy *= 0.99;
    
    // 如果速度很小则停止
    if (Math.abs(gameState.cueBall.dx) < 0.1) gameState.cueBall.dx = 0;
    if (Math.abs(gameState.cueBall.dy) < 0.1) gameState.cueBall.dy = 0;
}

// 游戏主循环
function gameLoop() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新游戏状态
    updateGame();
    
    // 渲染游戏
    renderGame();
    
    // 继续循环
    requestAnimationFrame(gameLoop);
}

// 鼠标交互变量
let isDragging = false;
let startX, startY;
let power = 0;

// 添加鼠标事件监听
canvas.addEventListener('mousedown', (e) => {
    if (gameState.cueBall.dx !== 0 || gameState.cueBall.dy !== 0) return;
    
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 计算力量
    const dx = gameState.cueBall.x - mouseX;
    const dy = gameState.cueBall.y - mouseY;
    power = Math.min(Math.sqrt(dx * dx + dy * dy) / 5, 20); // 限制最大力量
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 计算方向向量
    const dx = gameState.cueBall.x - mouseX;
    const dy = gameState.cueBall.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 10) { // 最小击球距离
        // 设置白球速度
        gameState.cueBall.dx = (dx / distance) * power;
        gameState.cueBall.dy = (dy / distance) * power;
    }
});

// 启动游戏
initGame();
gameLoop();

// 绘制力量指示器
function drawPowerIndicator() {
    if (isDragging) {
        ctx.beginPath();
        ctx.moveTo(gameState.cueBall.x, gameState.cueBall.y);
        ctx.lineTo(startX, startY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制力量条
        ctx.fillStyle = `rgba(255, ${255 - power * 12}, 0, 0.5)`;
        ctx.fillRect(10, 10, power * 10, 20);
    }
}

// 修改renderGame函数添加力量指示器
function renderGame() {
    // 绘制桌球台
    ctx.fillStyle = '#0a5c36';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制球袋
    const pocketRadius = 15;
    const pockets = [
        {x: 0, y: 0},
        {x: canvas.width/2, y: 0},
        {x: canvas.width, y: 0},
        {x: 0, y: canvas.height},
        {x: canvas.width/2, y: canvas.height},
        {x: canvas.width, y: canvas.height}
    ];
    
    ctx.fillStyle = '#000';
    pockets.forEach(pocket => {
        ctx.beginPath();
        ctx.arc(pocket.x, pocket.y, pocketRadius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 绘制所有球
    gameState.balls.forEach(ball => ball.draw());
    gameState.cueBall.draw();
    
    // 绘制力量指示器
    drawPowerIndicator();
}