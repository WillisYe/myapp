// 黑八桌球游戏
class PoolGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.gameState = 'aiming';
        this.currentTurn = 1;
        this.remainingBalls = 15;
        this.eightBallPocketed = false;
        this.gameWon = false;

        this.power = 0;
        this.maxPower = 20;
        this.isCharging = false;

        this.balls = [];
        this.pockets = [];
        this.cueBall = null;

        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;

        this.init();
        this.setupEvents();
        this.gameLoop();
    }

    init() {
        this.createPockets();
        this.cueBall = new Ball(this.width * 0.2, this.height / 2, 8, '#ffffff', true);
        this.createBalls();
        this.updateUI();
    }

    createPockets() {
        const r = 15;
        const m = 20;
        this.pockets = [
            {x: m, y: m}, {x: this.width-m, y: m},
            {x: m, y: this.height-m}, {x: this.width-m, y: this.height-m},
            {x: this.width/2, y: m}, {x: this.width/2, y: this.height-m}
        ];
    }

    createBalls() {
        this.balls = [];
        const colors = ['#ffd700', '#ff6b35', '#4ecdc4', '#45b7d1', '#96ceb4',
                       '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3',
                       '#ff9f43', '#10ac84', '#ee5253', '#341f97', '#000000'];

        const startX = this.width * 0.8;
        const startY = this.height / 2;
        const r = 8;
        const s = r * 2.1;

        let row = 0, ballsInRow = 1, x = startX, y = startY - s * 2;

        for (let i = 0; i < 15; i++) {
            if (i >= ballsInRow) {
                row++;
                ballsInRow = row + 1;
                x = startX - row * s * 0.866;
                y = startY - s * 2 + row * s * 0.5;
            }

            this.balls.push(new Ball(
                x + (i - (ballsInRow - row)) * s,
                y, r, colors[i], false, i === 14 ? 8 : i + 1
            ));
        }
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', e => {
            if (this.gameState === 'aiming') {
                this.isMouseDown = true;
                this.isCharging = true;
                this.power = 0;
            }
        });

        this.canvas.addEventListener('mousemove', e => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseup', e => {
            if (this.gameState === 'aiming' && this.isCharging) {
                this.isMouseDown = false;
                this.isCharging = false;
                this.shoot();
            }
        });

        document.getElementById('resetBtn').onclick = () => this.resetGame();
        document.getElementById('rulesBtn').onclick = () => this.showRules();
    }

    shoot() {
        if (this.power < 1) return;

        const dx = this.mouseX - this.cueBall.x;
        const dy = this.mouseY - this.cueBall.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d === 0) return;

        this.cueBall.vx = (dx / d) * this.power;
        this.cueBall.vy = (dy / d) * this.power;

        this.gameState = 'shooting';
        this.power = 0;
        this.updatePowerMeter();
    }

    update() {
        if (this.gameState !== 'shooting') return;

        let stopped = true;

        if (this.cueBall) {
            this.cueBall.update();
            this.checkCollisions(this.cueBall);
            this.checkPocket(this.cueBall);
            if (Math.abs(this.cueBall.vx) > 0.1 || Math.abs(this.cueBall.vy) > 0.1) stopped = false;
        }

        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            ball.update();
            this.checkCollisions(ball);
            this.checkPocket(ball);

            for (let j = i - 1; j >= 0; j--) {
                this.checkBallCollision(ball, this.balls[j]);
            }

            if (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) stopped = false;
        }

        if (stopped) {
            this.gameState = 'aiming';
            this.checkGameState();
        }
    }

    checkCollisions(ball) {
        if (ball.x - ball.radius <= 0) { ball.x = ball.radius; ball.vx = -ball.vx * 0.8; }
        if (ball.x + ball.radius >= this.width) { ball.x = this.width - ball.radius; ball.vx = -ball.vx * 0.8; }
        if (ball.y - ball.radius <= 0) { ball.y = ball.radius; ball.vy = -ball.vy * 0.8; }
        if (ball.y + ball.radius >= this.height) { ball.y = this.height - ball.radius; ball.vy = -ball.vy * 0.8; }
    }

    checkBallCollision(b1, b2) {
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < b1.radius + b2.radius) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const vx1 = b1.vx * cos + b1.vy * sin;
            const vy1 = b1.vy * cos - b1.vx * sin;
            const vx2 = b2.vx * cos + b2.vy * sin;
            const vy2 = b2.vy * cos - b2.vx * sin;

            b1.vx = vx2 * cos - vy1 * sin;
            b1.vy = vy1 * cos + vx2 * sin;
            b2.vx = vx1 * cos - vy2 * sin;
            b2.vy = vy2 * cos + vx1 * sin;

            const overlap = (b1.radius + b2.radius - d) / 2;
            b1.x -= overlap * cos;
            b1.y -= overlap * sin;
            b2.x += overlap * cos;
            b2.y += overlap * sin;
        }
    }

    checkPocket(ball) {
        for (const pocket of this.pockets) {
            const dx = ball.x - pocket.x;
            const dy = ball.y - pocket.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < 15) {
                if (ball === this.cueBall) {
                    this.foul();
                } else {
                    this.pocketBall(ball);
                }
                break;
            }
        }
    }

    pocketBall(ball) {
        const i = this.balls.indexOf(ball);
        if (i > -1) {
            this.balls.splice(i, 1);
            this.remainingBalls--;
            if (ball.number === 8) {
                this.eightBallPocketed = true;
                this.checkGameEnd();
            }
        }
        this.updateUI();
    }

    foul() {
        this.cueBall.x = this.width * 0.2;
        this.cueBall.y = this.height / 2;
        this.cueBall.vx = 0;
        this.cueBall.vy = 0;
        this.currentTurn = this.currentTurn === 1 ? 2 : 1;
        this.updateUI();
    }

    checkGameState() {
        if (this.remainingBalls === 0) {
            if (this.eightBallPocketed) {
                this.gameWon = true;
                this.gameState = 'gameOver';
            } else {
                this.gameState = 'gameOver';
            }
        }
    }

    checkGameEnd() {
        if (this.eightBallPocketed && this.remainingBalls === 0) {
            this.gameWon = true;
            this.gameState = 'gameOver';
        } else if (this.eightBallPocketed && this.remainingBalls > 0) {
            this.gameState = 'gameOver';
        }
    }

    updatePowerMeter() {
        const fill = document.getElementById('powerFill');
        fill.style.width = (this.power / this.maxPower) * 100 + '%';
    }

    updateUI() {
        document.getElementById('currentTurn').textContent = `玩家${this.currentTurn}`;
        document.getElementById('remainingBalls').textContent = this.remainingBalls;
        document.getElementById('eightBallStatus').textContent = this.eightBallPocketed ? '已入袋' : '未入袋';
    }

    resetGame() {
        this.gameState = 'aiming';
        this.currentTurn = 1;
        this.remainingBalls = 15;
        this.eightBallPocketed = false;
        this.gameWon = false;
        this.power = 0;
        this.isCharging = false;

        this.createBalls();
        this.cueBall.x = this.width * 0.2;
        this.cueBall.y = this.height / 2;
        this.cueBall.vx = 0;
        this.cueBall.vy = 0;

        this.updateUI();
        this.updatePowerMeter();
    }

    showRules() {
        alert('黑八桌球游戏规则：\n\n1. 目标：将8号球（黑球）击入袋中\n2. 规则：\n   - 必须先击打自己的球\n   - 白球入袋为犯规\n   - 8号球必须在最后击入\n3. 操作：按住鼠标左键蓄力，释放击球');
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 球袋
        this.ctx.fillStyle = '#000000';
        for (const pocket of this.pockets) {
            this.ctx.beginPath();
            this.ctx.arc(pocket.x, pocket.y, 15, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 球桌
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 20;
        this.ctx.strokeRect(10, 10, this.width - 20, this.height - 20);

        // 球
        for (const ball of this.balls) ball.render(this.ctx);
        if (this.cueBall) this.cueBall.render(this.ctx);

        // 瞄准线
        if (this.gameState === 'aiming' && this.cueBall) {
            this.drawAimLine();
        }

        // 游戏结束
        if (this.gameState === 'gameOver') {
            this.drawGameOver();
        }
    }

    drawAimLine() {
        const dx = this.mouseX - this.cueBall.x;
        const dy = this.mouseY - this.cueBall.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d === 0) return;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.cueBall.x, this.cueBall.y);
        this.ctx.lineTo(this.cueBall.x + (dx / d) * 100, this.cueBall.y + (dy / d) * 100);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';

        if (this.gameWon) {
            this.ctx.fillText('🎉 恭喜获胜！ 🎉', this.width / 2, this.height / 2 - 50);
        } else {
            this.ctx.fillText('😔 游戏失败', this.width / 2, this.height / 2 - 50);
        }

        this.ctx.font = '24px Arial';
        this.ctx.fillText('点击"重新开始"按钮继续游戏', this.width / 2, this.height / 2 + 20);
    }

    gameLoop() {
        if (this.isCharging && this.power < this.maxPower) {
            this.power += 0.5;
            this.updatePowerMeter();
        }

        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Ball {
    constructor(x, y, radius, color, isCueBall = false, number = 0) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
        this.color = color;
        this.isCueBall = isCueBall;
        this.number = number;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        if (!this.isCueBall) {
            ctx.fillStyle = this.color === '#000000' ? '#ffffff' : '#000000';
            ctx.font = `${this.radius * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.number.toString(), this.x, this.y);
        }
    }
}

window.addEventListener('load', () => {
    new PoolGame();
});
