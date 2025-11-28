// 黑八桌球游戏
class PoolGame {
    constructor() {
        // 初始化游戏
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // 桌球尺寸
        this.tableWidth = this.width * 0.9;
        this.tableHeight = this.height * 0.9;
        this.tableX = (this.width - this.tableWidth) / 2;
        this.tableY = (this.height - this.tableHeight) / 2;
        this.pocketRadius = 20;

        // 球的属性
        this.ballRadius = 15;
        this.friction = 0.99; // 摩擦系数

        // 游戏状态
        this.gameState = {
            currentPlayer: 1, // 1 或 2
            player1Type: null, // 'solid' 或 'stripe'
            player2Type: null,
            gameOver: false,
            winner: null,
            message: '玩家1回合'
        };

        // 击球状态
        this.shotState = {
            isAiming: false,      // 是否正在瞄准
            isChargingPower: false, // 是否正在蓄力
            targetBall: null,     // 目标球
            targetPoint: null,    // 目标点
            power: 0,             // 力量值 (0-100)
            maxPower: 100
        };

        // 初始化球
        this.initBalls();

        // 设置事件监听
        this.setupEventListeners();

        // 开始游戏循环
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    // 初始化球的位置
    initBalls() {
        this.balls = [];

        // 白球
        this.balls.push({
            id: 0,
            x: this.tableWidth * 0.25 + this.tableX,
            y: this.tableHeight / 2 + this.tableY,
            vx: 0,
            vy: 0,
            color: 'white',
            type: 'cue',
            inPocket: false
        });

        // 创建其他球的初始位置（三角形排列）
        const startX = this.tableWidth * 0.75 + this.tableX;
        const startY = this.tableHeight / 2 + this.tableY;
        const ballDiameter = this.ballRadius * 2;
        const rowCount = 5;

        let ballId = 1;
        let ballsToPlace = [
            { id: 1, color: 'yellow', type: 'solid' },
            { id: 2, color: 'blue', type: 'solid' },
            { id: 3, color: 'red', type: 'solid' },
            { id: 4, color: 'purple', type: 'solid' },
            { id: 5, color: 'orange', type: 'solid' },
            { id: 6, color: 'green', type: 'solid' },
            { id: 7, color: 'brown', type: 'solid' },
            { id: 8, color: 'black', type: 'eight' },
            { id: 9, color: 'yellow', type: 'stripe', stripeColor: 'white' },
            { id: 10, color: 'blue', type: 'stripe', stripeColor: 'white' },
            { id: 11, color: 'red', type: 'stripe', stripeColor: 'white' },
            { id: 12, color: 'purple', type: 'stripe', stripeColor: 'white' },
            { id: 13, color: 'orange', type: 'stripe', stripeColor: 'white' },
            { id: 14, color: 'green', type: 'stripe', stripeColor: 'white' },
            { id: 15, color: 'brown', type: 'stripe', stripeColor: 'white' }
        ];

        // 随机打乱球的顺序，但保持8号球在中间
        const eightBall = ballsToPlace.find(ball => ball.id === 8);
        const otherBalls = ballsToPlace.filter(ball => ball.id !== 8);
        this.shuffleArray(otherBalls);

        // 重新组合球，确保8号球在中间
        ballsToPlace = [
            ...otherBalls.slice(0, 4),
            eightBall,
            ...otherBalls.slice(4)
        ];

        let ballIndex = 0;
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col <= row; col++) {
                if (ballIndex < ballsToPlace.length) {
                    const ball = ballsToPlace[ballIndex];
                    this.balls.push({
                        id: ball.id,
                        x: startX + row * ballDiameter * 0.87,
                        y: startY - (row * ballDiameter / 2) + (col * ballDiameter),
                        vx: 0,
                        vy: 0,
                        color: ball.color,
                        type: ball.type,
                        stripeColor: ball.stripeColor,
                        inPocket: false
                    });
                    ballIndex++;
                }
            }
        }
    }

    // 随机打乱数组
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 设置事件监听
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // 重置按钮
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetGame();
            });
        }
    }

    // 处理鼠标按下事件
    handleMouseDown(e) {
        if (this.isAllBallsStopped() && !this.gameState.gameOver) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // 检查是否点击了白球
            const cueBall = this.getCueBall();

            if (!this.shotState.isAiming) {
                // 开始瞄准
                this.shotState.isAiming = true;
                this.shotState.targetPoint = { x: mouseX, y: mouseY };

                // 检查是否点击了其他球作为目标
                for (const ball of this.balls) {
                    if (ball.id !== 0 && !ball.inPocket) {
                        const distance = Math.sqrt(
                            Math.pow(mouseX - ball.x, 2) +
                            Math.pow(mouseY - ball.y, 2)
                        );

                        if (distance <= this.ballRadius) {
                            this.shotState.targetBall = ball;
                            break;
                        }
                    }
                }
            } else if (this.shotState.isAiming && !this.shotState.isChargingPower) {
                // 开始蓄力
                this.shotState.isChargingPower = true;
                this.shotState.power = 0;
            }
        }
    }

    // 处理鼠标移动事件
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.shotState.isAiming && !this.shotState.isChargingPower) {
            // 更新目标点
            this.shotState.targetPoint = { x: mouseX, y: mouseY };

            // 检查是否悬停在其他球上
            let hoveredBall = null;
            for (const ball of this.balls) {
                if (ball.id !== 0 && !ball.inPocket) {
                    const distance = Math.sqrt(
                        Math.pow(mouseX - ball.x, 2) +
                        Math.pow(mouseY - ball.y, 2)
                    );

                    if (distance <= this.ballRadius) {
                        hoveredBall = ball;
                        break;
                    }
                }
            }

            if (hoveredBall) {
                this.shotState.targetBall = hoveredBall;
            } else if (!this.shotState.targetBall) {
                // 如果没有目标球，使用鼠标位置作为目标点
                this.shotState.targetPoint = { x: mouseX, y: mouseY };
            }
        } else if (this.shotState.isChargingPower) {
            // 根据鼠标位置更新力量
            const cueBall = this.getCueBall();
            const distance = Math.sqrt(
                Math.pow(mouseX - cueBall.x, 2) +
                Math.pow(mouseY - cueBall.y, 2)
            );

            // 将距离映射到力量值 (0-100)
            this.shotState.power = Math.min(
                Math.max(distance / 3, 0),
                this.shotState.maxPower
            );

            // 更新力量条显示
            const powerBar = document.querySelector('.power-bar');
            powerBar.style.height = `${this.shotState.power}%`;
        }
    }

    // 处理鼠标释放事件
    handleMouseUp(e) {
        if (this.shotState.isChargingPower) {
            // 执行击球
            this.executeShot();

            // 重置击球状态
            this.shotState.isAiming = false;
            this.shotState.isChargingPower = false;
            this.shotState.targetBall = null;

            // 重置力量条显示
            const powerBar = document.querySelector('.power-bar');
            powerBar.style.height = '0%';
        }
    }

    // 执行击球
    executeShot() {
        const cueBall = this.getCueBall();
        if (!cueBall || this.shotState.power === 0) return;

        let targetX, targetY;

        if (this.shotState.targetBall) {
            // 如果有目标球，计算击球方向
            targetX = this.shotState.targetBall.x;
            targetY = this.shotState.targetBall.y;
        } else {
            // 否则使用目标点
            targetX = this.shotState.targetPoint.x;
            targetY = this.shotState.targetPoint.y;
        }

        // 计算方向向量
        const dx = targetX - cueBall.x;
        const dy = targetY - cueBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 标准化方向向量
        const dirX = dx / distance;
        const dirY = dy / distance;

        // 应用力量
        const speed = this.shotState.power / 10;
        cueBall.vx = -dirX * speed; // 反方向
        cueBall.vy = -dirY * speed; // 反方向

        // 记录当前状态，用于检查回合结果
        this.turnStarted = true;
        this.pocketedBallsThisTurn = [];
        this.firstHitBall = null;
    }

    // 游戏循环
    gameLoop(timestamp) {
        // 计算时间增量
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // 清除画布
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制游戏元素
        this.drawTable();
        this.drawBalls();
        this.drawAimingLine();
        this.drawPowerIndicator();
        this.drawGameStatus();

        // 更新球的位置和碰撞
        this.updateBalls(deltaTime);

        // 检查回合结果
        this.checkTurnResult();

        // 继续游戏循环
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    // 绘制桌面
    drawTable() {
        // 绘制边框
        this.ctx.fillStyle = '#8B4513'; // 棕色边框
        this.ctx.fillRect(
            this.tableX - 20,
            this.tableY - 20,
            this.tableWidth + 40,
            this.tableHeight + 40
        );

        // 绘制台面
        this.ctx.fillStyle = '#006400'; // 深绿色台面
        this.ctx.fillRect(
            this.tableX,
            this.tableY,
            this.tableWidth,
            this.tableHeight
        );

        // 绘制袋口
        const pockets = [
            { x: this.tableX, y: this.tableY }, // 左上
            { x: this.tableX + this.tableWidth / 2, y: this.tableY }, // 上中
            { x: this.tableX + this.tableWidth, y: this.tableY }, // 右上
            { x: this.tableX, y: this.tableY + this.tableHeight }, // 左下
            { x: this.tableX + this.tableWidth / 2, y: this.tableY + this.tableHeight }, // 下中
            { x: this.tableX + this.tableWidth, y: this.tableY + this.tableHeight } // 右下
        ];

        pockets.forEach(pocket => {
            this.ctx.beginPath();
            this.ctx.arc(pocket.x, pocket.y, this.pocketRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'black';
            this.ctx.fill();
        });
    }

    // 绘制球
    drawBalls() {
        this.balls.forEach(ball => {
            if (!ball.inPocket) {
                this.ctx.beginPath();
                this.ctx.arc(ball.x, ball.y, this.ballRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = ball.color;
                this.ctx.fill();
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();

                // 绘制球号
                this.ctx.fillStyle = ball.type === 'stripe' ? ball.color : 'white';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(ball.id, ball.x, ball.y);

                // 如果是条纹球，绘制条纹
                if (ball.type === 'stripe') {
                    this.ctx.beginPath();
                    this.ctx.arc(ball.x, ball.y, this.ballRadius, Math.PI / 4, Math.PI * 7 / 4);
                    this.ctx.fillStyle = 'white';
                    this.ctx.fill();

                    // 重新绘制球号
                    this.ctx.fillStyle = ball.color;
                    this.ctx.fillText(ball.id, ball.x, ball.y);
                }
            }
        });
    }

    // 绘制瞄准线和预测线
    drawAimingLine() {
        const cueBall = this.getCueBall();
        if (!cueBall || !this.shotState.isAiming || this.gameState.gameOver) return;

        let targetX, targetY;

        if (this.shotState.targetBall) {
            // 如果有目标球，瞄准该球
            targetX = this.shotState.targetBall.x;
            targetY = this.shotState.targetBall.y;
        } else if (this.shotState.targetPoint) {
            // 否则使用目标点
            targetX = this.shotState.targetPoint.x;
            targetY = this.shotState.targetPoint.y;
        } else {
            return;
        }

        // 计算方向向量
        const dx = targetX - cueBall.x;
        const dy = targetY - cueBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 标准化方向向量
        const dirX = dx / distance;
        const dirY = dy / distance;

        // 绘制瞄准线
        this.ctx.beginPath();
        this.ctx.moveTo(cueBall.x, cueBall.y);
        this.ctx.lineTo(targetX, targetY);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // 如果有目标球，绘制预测线
        if (this.shotState.targetBall) {
            // 计算白球碰撞后的方向
            const ballDirX = -dirX;
            const ballDirY = -dirY;

            // 绘制白球预测线
            this.ctx.beginPath();
            this.ctx.moveTo(cueBall.x, cueBall.y);
            this.ctx.lineTo(
                cueBall.x + ballDirX * 200,
                cueBall.y + ballDirY * 200
            );
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // 计算目标球碰撞后的方向
            const targetBall = this.shotState.targetBall;
            const targetDirX = dirX;
            const targetDirY = dirY;

            // 绘制目标球预测线
            this.ctx.beginPath();
            this.ctx.moveTo(targetBall.x, targetBall.y);
            this.ctx.lineTo(
                targetBall.x + targetDirX * 200,
                targetBall.y + targetDirY * 200
            );
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    // 绘制力量指示器
    drawPowerIndicator() {
        if (this.shotState.isChargingPower) {
            const cueBall = this.getCueBall();
            if (!cueBall) return;

            // 绘制力量指示环
            this.ctx.beginPath();
            this.ctx.arc(
                cueBall.x,
                cueBall.y,
                this.ballRadius + 5 + (this.shotState.power / 10),
                0,
                Math.PI * 2
            );
            this.ctx.strokeStyle = `rgba(255, ${255 - this.shotState.power * 2.55}, 0, 0.7)`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    // 绘制游戏状态
    drawGameStatus() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.gameState.message, this.width / 2, 30);

        // 显示玩家类型
        if (this.gameState.player1Type) {
            const player1Text = `玩家1: ${this.gameState.player1Type === 'solid' ? '实心球' : '条纹球'}`;
            const player2Text = `玩家2: ${this.gameState.player2Type === 'solid' ? '实心球' : '条纹球'}`;

            this.ctx.textAlign = 'left';
            this.ctx.fillText(player1Text, 20, 30);

            this.ctx.textAlign = 'right';
            this.ctx.fillText(player2Text, this.width - 20, 30);
        }
    }

    // 更新球的位置和碰撞
    updateBalls(deltaTime) {
        // 应用摩擦力和更新位置
        this.balls.forEach(ball => {
            if (!ball.inPocket) {
                // 应用摩擦力
                ball.vx *= this.friction;
                ball.vy *= this.friction;

                // 如果速度很小，则停止
                if (Math.abs(ball.vx) < 0.01 && Math.abs(ball.vy) < 0.01) {
                    ball.vx = 0;
                    ball.vy = 0;
                }

                // 更新位置
                ball.x += ball.vx;
                ball.y += ball.vy;

                // 检查边界碰撞
                this.handleBoundaryCollision(ball);

                // 检查是否进袋
                this.checkPocketCollision(ball);
            }
        });

        // 检查球与球之间的碰撞
        for (let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                const ballA = this.balls[i];
                const ballB = this.balls[j];

                if (!ballA.inPocket && !ballB.inPocket) {
                    this.handleBallCollision(ballA, ballB);
                }
            }
        }
    }

    // 处理边界碰撞
    handleBoundaryCollision(ball) {
        // 左右边界
        if (ball.x - this.ballRadius < this.tableX) {
            ball.x = this.tableX + this.ballRadius;
            ball.vx = -ball.vx * 0.9;
        } else if (ball.x + this.ballRadius > this.tableX + this.tableWidth) {
            ball.x = this.tableX + this.tableWidth - this.ballRadius;
            ball.vx = -ball.vx * 0.9;
        }

        // 上下边界
        if (ball.y - this.ballRadius < this.tableY) {
            ball.y = this.tableY + this.ballRadius;
            ball.vy = -ball.vy * 0.9;
        } else if (ball.y + this.ballRadius > this.tableY + this.tableHeight) {
            ball.y = this.tableY + this.tableHeight - this.ballRadius;
            ball.vy = -ball.vy * 0.9;
        }
    }

    // 处理球与球之间的碰撞
    handleBallCollision(ballA, ballB) {
        const dx = ballB.x - ballA.x;
        const dy = ballB.y - ballA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 检查是否碰撞
        if (distance < this.ballRadius * 2) {
            // 记录第一次碰撞的球
            if (this.turnStarted && !this.firstHitBall) {
                if (ballA.id === 0) {
                    this.firstHitBall = ballB;
                } else if (ballB.id === 0) {
                    this.firstHitBall = ballA;
                }
            }

            // 计算碰撞响应
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // 旋转速度向量
            const vx1 = ballA.vx * cos + ballA.vy * sin;
            const vy1 = ballA.vy * cos - ballA.vx * sin;
            const vx2 = ballB.vx * cos + ballB.vy * sin;
            const vy2 = ballB.vy * cos - ballB.vx * sin;

            // 碰撞后的速度
            const finalVx1 = vx2;
            const finalVx2 = vx1;
            const finalVy1 = vy1;
            const finalVy2 = vy2;

            // 旋转回原始坐标系
            ballA.vx = finalVx1 * cos - finalVy1 * sin;
            ballA.vy = finalVx1 * sin + finalVy1 * cos;
            ballB.vx = finalVx2 * cos - finalVy2 * sin;
            ballB.vy = finalVx2 * sin + finalVy2 * cos;

            // 分离球体，防止粘连
            const overlap = this.ballRadius * 2 - distance;
            const separationX = overlap * cos / 2;
            const separationY = overlap * sin / 2;

            ballA.x -= separationX;
            ballA.y -= separationY;
            ballB.x += separationX;
            ballB.y += separationY;
        }
    }

    // 检查球是否进袋
    checkPocketCollision(ball) {
        const pockets = [
            { x: this.tableX, y: this.tableY }, // 左上
            { x: this.tableX + this.tableWidth / 2, y: this.tableY }, // 上中
            { x: this.tableX + this.tableWidth, y: this.tableY }, // 右上
            { x: this.tableX, y: this.tableY + this.tableHeight }, // 左下
            { x: this.tableX + this.tableWidth / 2, y: this.tableY + this.tableHeight }, // 下中
            { x: this.tableX + this.tableWidth, y: this.tableY + this.tableHeight } // 右下
        ];

        for (const pocket of pockets) {
            const distance = Math.sqrt(
                Math.pow(ball.x - pocket.x, 2) +
                Math.pow(ball.y - pocket.y, 2)
            );

            if (distance < this.pocketRadius) {
                ball.inPocket = true;

                // 记录进袋的球
                if (this.turnStarted && ball.id !== 0) {
                    this.pocketedBallsThisTurn.push(ball);
                }

                // 如果是白球，重置位置
                if (ball.id === 0) {
                    this.resetCueBall();
                }

                break;
            }
        }
    }

    // 重置白球位置
    resetCueBall() {
        const cueBall = this.getCueBall();
        if (cueBall) {
            cueBall.x = this.tableWidth * 0.25 + this.tableX;
            cueBall.y = this.tableHeight / 2 + this.tableY;
            cueBall.vx = 0;
            cueBall.vy = 0;
            cueBall.inPocket = false;
        }
    }

    // 获取白球
    getCueBall() {
        return this.balls.find(ball => ball.id === 0);
    }

    // 检查所有球是否停止
    isAllBallsStopped() {
        return this.balls.every(ball => {
            return ball.inPocket || (Math.abs(ball.vx) < 0.01 && Math.abs(ball.vy) < 0.01);
        });
    }

    // 检查回合结果
    checkTurnResult() {
        // 如果游戏已结束，不再检查
        if (this.gameState.gameOver) return;

        // 如果回合未开始或球仍在移动，不检查
        if (!this.turnStarted || !this.isAllBallsStopped()) return;

        // 回合已结束，检查结果
        let switchPlayer = true;
        let foul = false;
        let gameOver = false;
        let winner = null;
        let message = '';

        // 检查白球是否进袋
        const cueBall = this.getCueBall();
        if (cueBall.inPocket) {
            foul = true;
            message = '白球进袋，犯规！';
        }

        // 检查第一个击中的球
        if (this.firstHitBall) {
            // 如果球类型已分配
            if (this.gameState.player1Type) {
                const currentPlayerType = this.gameState.currentPlayer === 1 ?
                    this.gameState.player1Type : this.gameState.player2Type;

                // 检查是否击中正确类型的球
                if (this.firstHitBall.type !== currentPlayerType && this.firstHitBall.type !== 'eight') {
                    foul = true;
                    message = `击中错误类型的球，犯规！`;
                }
            }
        } else if (this.turnStarted) {
            // 如果没有击中任何球
            foul = true;
            message = '没有击中任何球，犯规！';
        }

        // 检查进袋的球
        if (this.pocketedBallsThisTurn.length > 0) {
            // 如果球类型尚未分配
            if (!this.gameState.player1Type) {
                const firstPocketedBall = this.pocketedBallsThisTurn[0];
                if (firstPocketedBall.type === 'solid' || firstPocketedBall.type === 'stripe') {
                    this.gameState.player1Type = firstPocketedBall.type;
                    this.gameState.player2Type = firstPocketedBall.type === 'solid' ? 'stripe' : 'solid';
                    message = `玩家1选择了${firstPocketedBall.type === 'solid' ? '实心球' : '条纹球'}`;
                }
            }

            // 检查是否有正确类型的球进袋
            const currentPlayerType = this.gameState.currentPlayer === 1 ?
                this.gameState.player1Type : this.gameState.player2Type;

            const correctBallsPocketed = this.pocketedBallsThisTurn.filter(
                ball => ball.type === currentPlayerType
            ).length;

            const eightBallPocketed = this.pocketedBallsThisTurn.find(
                ball => ball.type === 'eight'
            );

            // 如果有正确类型的球进袋，不切换玩家
            if (correctBallsPocketed > 0) {
                switchPlayer = false;
                message = `玩家${this.gameState.currentPlayer}继续击球`;
            }

            // 检查8号球是否进袋
            if (eightBallPocketed) {
                // 检查玩家是否已经击落所有自己的球
                const playerBallsLeft = this.balls.filter(ball =>
                    !ball.inPocket &&
                    ball.type === currentPlayerType
                ).length;

                if (playerBallsLeft === 0) {
                    // 玩家获胜
                    gameOver = true;
                    winner = this.gameState.currentPlayer;
                    message = `玩家${winner}获胜！`;
                } else {
                    // 玩家输掉游戏
                    gameOver = true;
                    winner = this.gameState.currentPlayer === 1 ? 2 : 1;
                    message = `玩家${this.gameState.currentPlayer}提前击落8号球，玩家${winner}获胜！`;
                }
            }
        }

        // 更新游戏状态
        if (gameOver) {
            this.gameState.gameOver = true;
            this.gameState.winner = winner;
            this.gameState.message = message;
        } else {
            if (message) {
                this.gameState.message = message;
            }

            if (switchPlayer) {
                this.gameState.currentPlayer = this.gameState.currentPlayer === 1 ? 2 : 1;
                this.gameState.message = `玩家${this.gameState.currentPlayer}回合`;
            }
        }

        // 重置回合状态
        this.turnStarted = false;
        this.pocketedBallsThisTurn = [];
        this.firstHitBall = null;
    }

    // 重置游戏
    resetGame() {
        this.balls = [];
        this.initBalls();

        this.gameState = {
            currentPlayer: 1,
            player1Type: null,
            player2Type: null,
            gameOver: false,
            winner: null,
            message: '玩家1回合'
        };

        this.shotState = {
            isAiming: false,
            isChargingPower: false,
            targetBall: null,
            targetPoint: null,
            power: 0,
            maxPower: 100
        };

        this.turnStarted = false;
        this.pocketedBallsThisTurn = [];
        this.firstHitBall = null;
    }
}