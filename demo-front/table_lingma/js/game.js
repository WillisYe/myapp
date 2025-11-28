// 游戏常量定义
const BALL_RADIUS = 10;
const POCKET_RADIUS = 20;
const FRICTION = 0.99;
const MIN_VELOCITY = 0.1;

// 球类型常量
const BALL_TYPE_UNKNOWN = 0;
const BALL_TYPE_SOLID = 1;  // 全色球 (1-7号)
const BALL_TYPE_STRIPED = 2; // 花色球 (9-15号)
const BALL_TYPE_BLACK = 3;   // 黑八球 (8号)

// 玩家常量
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;

// 游戏状态
const GAME_STATE_AIMING = 1;
const GAME_STATE_SHOOTING = 2;
const GAME_STATE_ROLLING = 3;
const GAME_STATE_END = 4;

class Ball {
    constructor(x, y, number, color) {
        this.x = x;
        this.y = y;
        this.number = number;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.pocketed = false;
    }

    draw(ctx) {
        if (this.pocketed) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 绘制球上的数字
        if (this.number !== 0) {
            ctx.fillStyle = this.number <= 7 ? '#FFFFFF' : '#000000';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.number.toString(), this.x, this.y);
            
            if (this.number > 8) {
                ctx.fillStyle = this.number <= 15 ? '#FFFFFF' : '#000000';
                ctx.beginPath();
                ctx.arc(this.x, this.y, BALL_RADIUS/2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000000';
                ctx.fillText(this.number.toString(), this.x, this.y);
            }
        }
    }

    update() {
        if (this.pocketed) return;

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 应用摩擦力
        this.vx *= FRICTION;
        this.vy *= FRICTION;

        // 如果速度过慢，则停止
        if (Math.abs(this.vx) < MIN_VELOCITY && Math.abs(this.vy) < MIN_VELOCITY) {
            this.vx = 0;
            this.vy = 0;
        }
    }

    isMoving() {
        return Math.abs(this.vx) > MIN_VELOCITY || Math.abs(this.vy) > MIN_VELOCITY;
    }
}

class PoolGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.balls = [];
        this.cueBall = null; // 白球
        this.currentPlayer = PLAYER_ONE;
        this.player1Type = BALL_TYPE_UNKNOWN;
        this.player2Type = BALL_TYPE_UNKNOWN;
        this.gameState = GAME_STATE_AIMING;
        this.mouseX = 0;
        this.mouseY = 0;
        this.power = 0;
        this.pockets = [];
        
        this.initPockets();
        this.initBalls();
        this.setupEventListeners();
        this.gameLoop();
    }

    initPockets() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 四个角落和两个边上的球袋
        this.pockets = [
            {x: 0, y: 0},                   // 左上
            {x: width/2, y: 0},             // 上中
            {x: width, y: 0},               // 右上
            {x: 0, y: height},              // 左下
            {x: width/2, y: height},        // 下中
            {x: width, y: height}           // 右下
        ];
    }

    initBalls() {
        // 清空球数组
        this.balls = [];
        
        // 创建球 - 三角形排列
        const startX = this.canvas.width - 200;
        const startY = this.canvas.height / 2;
        const gap = BALL_RADIUS * 2 + 2;
        
        // 创建15个目标球，按三角形排列
        let ballNumber = 1;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col <= row; col++) {
                let x = startX + row * gap * Math.cos(Math.PI/6);
                let y = startY - (row * gap) / 2 + col * gap;
                
                let color;
                if (ballNumber === 8) {
                    color = '#000000'; // 黑八
                } else if (ballNumber < 8) {
                    // 全色球
                    const colors = ['#FFFF00', '#0000FF', '#FF0000', '#800080', '#FFA500', '#008000', '#8B0000'];
                    color = colors[(ballNumber - 1) % colors.length];
                } else {
                    // 花色球
                    const colors = ['#FFFF00', '#0000FF', '#FF0000', '#800080', '#FFA500', '#008000', '#8B0000'];
                    color = colors[(ballNumber - 9) % colors.length];
                }
                
                this.balls.push(new Ball(x, y, ballNumber, color));
                ballNumber++;
            }
        }
        
        // 创建白球
        this.cueBall = new Ball(100, this.canvas.height / 2, 0, '#FFFFFF');
        this.balls.push(this.cueBall);
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('click', () => {
            if (this.gameState === GAME_STATE_AIMING) {
                this.shoot();
            }
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
    }

    shoot() {
        if (this.cueBall.pocketed) return;
        
        // 计算击球方向和力度
        const dx = this.cueBall.x - this.mouseX;
        const dy = this.cueBall.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 限制最大力度
        const maxPower = 15;
        this.power = Math.min(distance / 10, maxPower);
        
        // 设置白球速度
        this.cueBall.vx = (dx / distance) * this.power;
        this.cueBall.vy = (dy / distance) * this.power;
        
        this.gameState = GAME_STATE_ROLLING;
    }

    update() {
        // 更新所有球的位置
        for (const ball of this.balls) {
            ball.update();
        }

        // 检查球是否入袋
        this.checkPocketCollisions();

        // 检查球与球之间的碰撞
        this.checkBallCollisions();

        // 检查是否所有球都停止了
        if (this.gameState === GAME_STATE_ROLLING && !this.isAnyBallMoving()) {
            this.gameState = GAME_STATE_AIMING;
            this.switchPlayer();
        }

        // 检查白球是否入袋，如果入袋则重置
        if (this.cueBall.pocketed) {
            this.resetCueBall();
        }
    }

    checkPocketCollisions() {
        for (const ball of this.balls) {
            if (ball.pocketed) continue;

            for (const pocket of this.pockets) {
                const dx = ball.x - pocket.x;
                const dy = ball.y - pocket.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < POCKET_RADIUS) {
                    ball.pocketed = true;
                    
                    // 如果是黑八入袋，游戏结束
                    if (ball.number === 8) {
                        this.gameState = GAME_STATE_END;
                        alert(`游戏结束! 玩家 ${this.currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE} 获胜!`);
                    }
                    break;
                }
            }
        }
    }

    checkBallCollisions() {
        for (let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                const ball1 = this.balls[i];
                const ball2 = this.balls[j];

                if (ball1.pocketed || ball2.pocketed) continue;

                const dx = ball2.x - ball1.x;
                const dy = ball2.y - ball1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 如果球相撞
                if (distance < BALL_RADIUS * 2) {
                    // 计算碰撞后的速度
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    // 旋转速度向量
                    const vx1 = ball1.vx * cos + ball1.vy * sin;
                    const vy1 = ball1.vy * cos - ball1.vx * sin;
                    const vx2 = ball2.vx * cos + ball2.vy * sin;
                    const vy2 = ball2.vy * cos - ball2.vx * sin;

                    // 一维弹性碰撞
                    const finalVx1 = ((BALL_RADIUS * 2 - BALL_RADIUS * 2) * vx1 + (2 * BALL_RADIUS * 2) * vx2) / (BALL_RADIUS * 2 + BALL_RADIUS * 2);
                    const finalVx2 = ((2 * BALL_RADIUS * 2) * vx1 + (BALL_RADIUS * 2 - BALL_RADIUS * 2) * vx2) / (BALL_RADIUS * 2 + BALL_RADIUS * 2);

                    // 旋转回原坐标系
                    ball1.vx = finalVx1 * cos - vy1 * sin;
                    ball1.vy = vy1 * cos + finalVx1 * sin;
                    ball2.vx = finalVx2 * cos - vy2 * sin;
                    ball2.vy = vy2 * cos + finalVx2 * sin;

                    // 防止球重叠
                    const overlap = BALL_RADIUS * 2 - distance;
                    const moveX = overlap * Math.cos(angle) / 2;
                    const moveY = overlap * Math.sin(angle) / 2;
                    
                    ball1.x -= moveX;
                    ball1.y -= moveY;
                    ball2.x += moveX;
                    ball2.y += moveY;
                }
            }
        }
    }

    isAnyBallMoving() {
        return this.balls.some(ball => ball.isMoving());
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
        document.getElementById('currentPlayer').textContent = `Player ${this.currentPlayer}`;
    }

    resetCueBall() {
        // 将白球放回台面
        this.cueBall.pocketed = false;
        this.cueBall.x = 100;
        this.cueBall.y = this.canvas.height / 2;
        this.cueBall.vx = 0;
        this.cueBall.vy = 0;
    }

    resetGame() {
        this.currentPlayer = PLAYER_ONE;
        this.player1Type = BALL_TYPE_UNKNOWN;
        this.player2Type = BALL_TYPE_UNKNOWN;
        this.gameState = GAME_STATE_AIMING;
        document.getElementById('currentPlayer').textContent = 'Player 1';
        document.getElementById('ballType').textContent = '未选择';
        this.initBalls();
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制球桌边缘
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制球袋
        this.ctx.fillStyle = '#000000';
        for (const pocket of this.pockets) {
            this.ctx.beginPath();
            this.ctx.arc(pocket.x, pocket.y, POCKET_RADIUS, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 绘制所有球
        for (const ball of this.balls) {
            ball.draw(this.ctx);
        }
        
        // 如果是瞄准状态，绘制辅助线
        if (this.gameState === GAME_STATE_AIMING && !this.cueBall.pocketed) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.cueBall.x, this.cueBall.y);
            this.ctx.lineTo(this.mouseX, this.mouseY);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 启动游戏
window.onload = () => {
    new PoolGame();
};