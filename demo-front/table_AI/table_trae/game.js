// 游戏常量
const BALL_RADIUS = 15;
const CUE_BALL_RADIUS = 15;
const POCKET_RADIUS = 22;
const TABLE_PADDING = 50;
const MAX_SHOT_FORCE = 8; // 降低最大力度使游戏更易控制
const FRICTION = 0.97;
const HOLE_FRICTION = 0.8;
const COLLISION_DAMPING = 0.85; // 增加碰撞弹性
const HOLE_SPEED_THRESHOLD = 0.5;
const MIN_SHOT_DISTANCE = 10; // 最小击球距离

// 游戏状态
let gameState = {
    balls: [],
    pockets: [],
    tableBounds: {},
    cueBall: null,
    isAiming: false,
    aimStart: { x: 0, y: 0 },
    aimEnd: { x: 0, y: 0 },
    currentPlayer: 'player1', // 玩家1或玩家2
    gameStarted: false,
    playerType: null, // 玩家类型，null表示尚未确定
    solidsPotted: 0,
    stripesPotted: 0,
    blackBallPotted: false,
    isGameOver: false,
    isFreeBall: false, // 新增：自由球状态
    playerStats: {
        player1: {
            type: null,
            score: 0
        },
        player2: {
            type: null,
            score: 0
        }
    }
};

// DOM元素
let canvas, ctx;
let aimLine, gameContainer;
let playerInfo, gameStatus;
let helpModal, closeHelpBtn, restartBtn, helpBtn;
let gameOverModal, gameOverTitle, gameOverMessage, playAgainBtn;

// 触摸变量
let touchStartX, touchStartY;

// 球的类型和颜色
const BALL_TYPES = {
    CUE: { number: 0, color: '#f5f5f5' },
    SOLID_1: { number: 1, color: '#ffd700', type: 'solids' },
    SOLID_2: { number: 2, color: '#1e90ff', type: 'solids' },
    SOLID_3: { number: 3, color: '#dc143c', type: 'solids' },
    SOLID_4: { number: 4, color: '#9370db', type: 'solids' },
    SOLID_5: { number: 5, color: '#ffa500', type: 'solids' },
    SOLID_6: { number: 6, color: '#228b22', type: 'solids' },
    SOLID_7: { number: 7, color: '#a52a2a', type: 'solids' },
    STRIPE_9: { number: 9, color: '#ffd700', type: 'stripes' },
    STRIPE_10: { number: 10, color: '#1e90ff', type: 'stripes' },
    STRIPE_11: { number: 11, color: '#dc143c', type: 'stripes' },
    STRIPE_12: { number: 12, color: '#9370db', type: 'stripes' },
    STRIPE_13: { number: 13, color: '#ffa500', type: 'stripes' },
    STRIPE_14: { number: 14, color: '#228b22', type: 'stripes' },
    STRIPE_15: { number: 15, color: '#a52a2a', type: 'stripes' },
    BLACK: { number: 8, color: '#0a0a0a' }
};

// 初始化游戏
function initGame() {
    // 获取DOM元素
    canvas = document.getElementById('poolCanvas');
    ctx = canvas.getContext('2d');
    aimLine = document.getElementById('aimLine');
    gameContainer = document.getElementById('gameContainer');
    playerInfo = document.getElementById('playerInfo');
    gameStatus = document.getElementById('gameStatus');
    helpModal = document.getElementById('helpModal');
    closeHelpBtn = document.getElementById('closeHelpBtn');
    restartBtn = document.getElementById('restartBtn');
    helpBtn = document.getElementById('helpBtn');
    gameOverModal = document.getElementById('gameOverModal');
    gameOverTitle = document.getElementById('gameOverTitle');
    gameOverMessage = document.getElementById('gameOverMessage');
    playAgainBtn = document.getElementById('playAgainBtn');

    // 设置画布大小
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化游戏对象
    initTable();
    initBalls();
    initPockets();

    // 添加触摸事件监听器
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // 添加鼠标事件监听器（用于桌面调试）
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    // 添加按钮事件监听器
    closeHelpBtn.addEventListener('click', () => helpModal.classList.add('hidden'));
    restartBtn.addEventListener('click', restartGame);
    helpBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
    playAgainBtn.addEventListener('click', restartGame);

    // 开始游戏循环
    gameLoop();
}

// 调整画布大小以适应屏幕
function resizeCanvas() {
    const containerRect = gameContainer.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
    
    // 重新初始化球桌和球的位置
    if (gameState.balls.length > 0) {
        initTable();
        resetBallPositions();
    }
}

// 初始化球桌边界
function initTable() {
    gameState.tableBounds = {
        left: TABLE_PADDING,
        top: TABLE_PADDING,
        right: canvas.width - TABLE_PADDING,
        bottom: canvas.height - TABLE_PADDING,
        width: canvas.width - 2 * TABLE_PADDING,
        height: canvas.height - 2 * TABLE_PADDING
    };
}

// 初始化球袋
function initPockets() {
    const { left, top, right, bottom } = gameState.tableBounds;
    const cornerOffset = POCKET_RADIUS;
    
    gameState.pockets = [
        { x: left + cornerOffset, y: top + cornerOffset }, // 左上角
        { x: right - cornerOffset, y: top + cornerOffset }, // 右上角
        { x: right - cornerOffset, y: bottom - cornerOffset }, // 右下角
        { x: left + cornerOffset, y: bottom - cornerOffset }, // 左下角
        { x: (left + right) / 2, y: top + cornerOffset }, // 顶边中间
        { x: (left + right) / 2, y: bottom - cornerOffset } // 底边中间
    ];
}

// 初始化球的位置
function initBalls() {
    gameState.balls = [];
    
    // 放置白球（主球）
    const cueBallX = gameState.tableBounds.left + gameState.tableBounds.width * 0.25;
    const cueBallY = gameState.tableBounds.top + gameState.tableBounds.height * 0.5;
    const cueBall = createBall(cueBallX, cueBallY, BALL_TYPES.CUE);
    gameState.balls.push(cueBall);
    gameState.cueBall = cueBall;
    
    // 放置其他球（三角形排列）
    const rackX = gameState.tableBounds.right - gameState.tableBounds.width * 0.25;
    const rackY = gameState.tableBounds.top + gameState.tableBounds.height * 0.5;
    const ballSpacing = BALL_RADIUS * 2;
    
    // 黑八放在中心
    const blackBall = createBall(rackX, rackY, BALL_TYPES.BLACK);
    gameState.balls.push(blackBall);
    
    // 排列其他球
    let ballTypes = [
        BALL_TYPES.SOLID_1, BALL_TYPES.STRIPE_9, BALL_TYPES.SOLID_2, BALL_TYPES.STRIPE_10,
        BALL_TYPES.SOLID_3, BALL_TYPES.STRIPE_11, BALL_TYPES.SOLID_4, BALL_TYPES.STRIPE_12,
        BALL_TYPES.SOLID_5, BALL_TYPES.STRIPE_13, BALL_TYPES.SOLID_6, BALL_TYPES.STRIPE_14,
        BALL_TYPES.SOLID_7, BALL_TYPES.STRIPE_15
    ];
    
    // 随机打乱球的顺序
    ballTypes = shuffleArray(ballTypes);
    
    let ballIndex = 0;
    
    // 正三角形排列，顶点正对白球方向（左侧）
    for (let row = 1; row <= 5; row++) {
        for (let col = 0; col < row; col++) {
            if (row === 3 && col === 1) continue; // 中心位置已经放了黑八
            
            // 正三角形排列计算，顶点指向左侧（白球方向）
            // 行高使用等边三角形高度公式：h = (√3/2) * 边长
            const x = rackX - (row - 1) * ballSpacing * 0.5 + col * ballSpacing;
            const y = rackY + (row - 3) * ballSpacing * Math.sqrt(3) * 0.5;
            
            if (ballIndex < ballTypes.length) {
                const ball = createBall(x, y, ballTypes[ballIndex]);
                gameState.balls.push(ball);
                ballIndex++;
            }
        }
    }
}

// 重置球的位置
function resetBallPositions() {
    initBalls();
    initPockets();
    gameState.isGameOver = false;
    gameState.gameStarted = false;
    gameState.playerType = null;
    gameState.solidsPotted = 0;
    gameState.stripesPotted = 0;
    gameState.blackBallPotted = false;
    updateGameStatus();
}

// 创建球对象
function createBall(x, y, type) {
    return {
        x: x,
        y: y,
        radius: BALL_RADIUS,
        vx: 0,
        vy: 0,
        type: type,
        isPotted: false,
        isCueBall: type.number === 0
    };
}

// 打乱数组顺序（用于随机排列球）
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 触摸开始处理函数
function handleTouchStart(e) {
    e.preventDefault();
    if (isAnyBallMoving() || gameState.isGameOver) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (gameState.isFreeBall) {
        // 自由球状态：点击任意位置放置白球
        placeCueBall(x, y);
    } else {
        // 检查是否触摸到主球
        if (isPointInBall(x, y, gameState.cueBall)) {
            gameState.isAiming = true;
            gameState.aimStart = { x: x, y: y };
            gameState.aimEnd = { x: x, y: y };
            updateAimLine();
        }
    }
}

// 新增：放置白球（自由球规则）
function placeCueBall(x, y) {
    // 确保白球放置在球桌内且不与其他球重叠
    const cueBall = gameState.cueBall;
    let canPlace = true;
    
    // 检查是否在球桌内
    if (x < gameState.tableBounds.left || x > gameState.tableBounds.right ||
        y < gameState.tableBounds.top || y > gameState.tableBounds.bottom) {
        return;
    }
    
    // 检查是否与其他球重叠
    for (const ball of gameState.balls) {
        if (!ball.isPotted && !ball.isCueBall) {
            const dx = x - ball.x;
            const dy = y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ball.radius + cueBall.radius) {
                canPlace = false;
                break;
            }
        }
    }
    
    if (canPlace) {
        cueBall.x = x;
        cueBall.y = y;
        gameState.isFreeBall = false;
        gameStatus.textContent = '轮到你击球';
    }
}

// 触摸移动处理函数
function handleTouchMove(e) {
    e.preventDefault();
    if (!gameState.isAiming || gameState.isGameOver) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    gameState.aimEnd = { x: x, y: y };
    updateAimLine();
}

// 鼠标按下处理函数（用于桌面调试）
function handleMouseDown(e) {
    e.preventDefault();
    if (isAnyBallMoving() || gameState.isGameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (gameState.isFreeBall) {
        // 自由球状态：点击任意位置放置白球
        placeCueBall(x, y);
    } else {
        // 检查是否点击到主球
        if (isPointInBall(x, y, gameState.cueBall)) {
            gameState.isAiming = true;
            gameState.aimStart = { x: x, y: y };
            gameState.aimEnd = { x: x, y: y };
            updateAimLine();
        }
    }
}

// 鼠标移动处理函数（用于桌面调试）
function handleMouseMove(e) {
    e.preventDefault();
    if (!gameState.isAiming || gameState.isGameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    gameState.aimEnd = { x: x, y: y };
    updateAimLine();
}

// 鼠标释放处理函数（用于桌面调试）
function handleMouseUp(e) {
    e.preventDefault();
    if (!gameState.isAiming || gameState.isGameOver) return;
    
    gameState.isAiming = false;
    aimLine.classList.add('hidden');
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = gameState.aimStart.x - x;
    const dy = gameState.aimStart.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 只有当拖动距离超过最小距离时才击球
    if (distance >= MIN_SHOT_DISTANCE) {
        const speedFactor = Math.min(distance / 100, MAX_SHOT_FORCE);
        const vx = dx * 0.1 * speedFactor;
        const vy = dy * 0.1 * speedFactor;
        
        gameState.cueBall.vx = vx;
        gameState.cueBall.vy = vy;
        
        if (!gameState.gameStarted) {
            gameState.gameStarted = true;
        }
        
        updateGameStatus();
    }
}

// 更新瞄准线
function updateAimLine() {
    const dx = gameState.aimEnd.x - gameState.aimStart.x;
    const dy = gameState.aimEnd.y - gameState.aimStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 如果拖动距离太小，不显示瞄准线
    if (distance < 10) {
        aimLine.classList.add('hidden');
        return;
    }
    
    // 计算角度
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // 设置瞄准线样式和位置
    aimLine.style.width = `${distance}px`;
    aimLine.style.height = '2px';
    aimLine.style.left = `${gameState.aimStart.x}px`;
    aimLine.style.top = `${gameState.aimStart.y}px`;
    aimLine.style.transform = `rotate(${angle}deg)`;
    
    // 显示瞄准线
    aimLine.classList.remove('hidden');
}

// 检查点是否在球内
function isPointInBall(x, y, ball) {
    const dx = x - ball.x;
    const dy = y - ball.y;
    return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
}

// 触摸结束处理函数
function handleTouchEnd(e) {
    e.preventDefault();
    if (!gameState.isAiming || gameState.isGameOver) return;
    
    gameState.isAiming = false;
    aimLine.classList.add('hidden');
    
    // 计算击球力度和方向
    const dx = gameState.aimStart.x - gameState.aimEnd.x;
    const dy = gameState.aimStart.y - gameState.aimEnd.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 只有当拖动距离超过最小距离时才击球
    if (distance >= MIN_SHOT_DISTANCE) {
        // 根据拖动距离计算速度，但限制最大速度
        const speedFactor = Math.min(distance / 100, MAX_SHOT_FORCE);
        const vx = dx * 0.1 * speedFactor;
        const vy = dy * 0.1 * speedFactor;
        
        // 设置主球速度
        gameState.cueBall.vx = vx;
        gameState.cueBall.vy = vy;
        
        // 标记游戏为已开始
        if (!gameState.gameStarted) {
            gameState.gameStarted = true;
        }
        
        // 更新游戏状态
        updateGameStatus();
    }
}

// 检查球是否进袋
function checkPockets() {
    let pottedBalls = [];
    let pottedCueBall = false;
    let pottedBlackBall = false;
    let pottedSolid = false;
    let pottedStripe = false;
    
    // 检查每个球是否进袋
    gameState.balls.forEach(ball => {
        if (!ball.isPotted) {
            for (let i = 0; i < gameState.pockets.length; i++) {
                const pocket = gameState.pockets[i];
                const dx = ball.x - pocket.x;
                const dy = ball.y - pocket.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 如果球中心到球袋中心的距离小于球袋半径减去球半径，则认为球进袋
                if (distance <= POCKET_RADIUS - ball.radius) {
                    // 记录球进袋信息
                    ball.isPotted = true;
                    pottedBalls.push(ball);
                    
                    if (ball.isCueBall) {
                        pottedCueBall = true;
                    } else if (ball.type.number === 8) {
                        pottedBlackBall = true;
                        gameState.blackBallPotted = true;
                    } else if (ball.type.type === 'solids') {
                        pottedSolid = true;
                        gameState.solidsPotted++;
                        gameState.playerStats[gameState.currentPlayer].score++;
                    } else if (ball.type.type === 'stripes') {
                        pottedStripe = true;
                        gameState.stripesPotted++;
                        gameState.playerStats[gameState.currentPlayer].score++;
                    }
                    
                    break; // 一个球只能进一个袋
                }
            }
        }
    });
    
    // 如果有球进袋，处理游戏逻辑
    if (pottedBalls.length > 0) {
        // 如果白球进袋，犯规
        if (pottedCueBall) {
            // 白球进袋，自由球
            gameState.isFreeBall = true;
            
            // 重置白球位置
            gameState.cueBall.x = gameState.tableBounds.left + gameState.tableBounds.width * 0.25;
            gameState.cueBall.y = gameState.tableBounds.top + gameState.tableBounds.height * 0.5;
            gameState.cueBall.isPotted = false;
            
            // 切换玩家
            gameState.currentPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
            gameStatus.textContent = '白球进袋，换玩家击球';
        } else if (pottedBlackBall) {
            // 黑八球进袋，检查游戏结束条件
            const remainingBalls = gameState.balls.filter(ball => 
                !ball.isPotted && !ball.isCueBall && ball.type.number !== 8
            );
            
            if (remainingBalls.length === 0) {
                // 没有其他球了，当前玩家获胜
                endGame(true, `${gameState.currentPlayer === 'player1' ? '玩家1' : '玩家2'}成功打进黑八，赢得比赛！`);
            } else {
                // 还有其他球，当前玩家输掉比赛
                endGame(false, `${gameState.currentPlayer === 'player1' ? '玩家1' : '玩家2'}过早打进黑八，输掉比赛！`);
            }
        } else {
            // 如果是第一次进球，确定玩家类型
            if (gameState.playerType === null) {
                if (pottedSolid) {
                    gameState.playerType = 'solids';
                    gameState.playerStats[gameState.currentPlayer].type = 'solids';
                } else if (pottedStripe) {
                    gameState.playerType = 'stripes';
                    gameState.playerStats[gameState.currentPlayer].type = 'stripes';
                }
            }
            
            // 检查是否连续进球，决定是否切换玩家
            if ((gameState.playerType === 'solids' && !pottedSolid) ||
                (gameState.playerType === 'stripes' && !pottedStripe)) {
                // 没有打进自己类型的球，切换玩家
                gameState.currentPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
                
                // 如果是第一次切换，设置新玩家的类型
                if (gameState.playerStats[gameState.currentPlayer].type === null) {
                    gameState.playerStats[gameState.currentPlayer].type = 
                        gameState.playerType === 'solids' ? 'stripes' : 'solids';
                }
                
                gameState.playerType = gameState.playerStats[gameState.currentPlayer].type;
            }
        }
    }
}

// 检查球与球之间的碰撞
function checkBallCollisions() {
    const balls = gameState.balls.filter(ball => !ball.isPotted);
    
    // 检查每对球之间的碰撞
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const ball1 = balls[i];
            const ball2 = balls[j];
            
            // 只有当两个球都在移动时才检测碰撞
            if ((ball1.vx === 0 && ball1.vy === 0) && (ball2.vx === 0 && ball2.vy === 0)) {
                continue;
            }
            
            const dx = ball2.x - ball1.x;
            const dy = ball2.y - ball1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果两球距离小于两球半径之和，则发生碰撞
            if (distance < ball1.radius + ball2.radius) {
                // 计算碰撞后的速度
                const nx = dx / distance;
                const ny = dy / distance;
                const tx = -ny;
                const ty = nx;
                
                // 计算切向和法向速度分量
                const v1n = ball1.vx * nx + ball1.vy * ny;
                const v1t = ball1.vx * tx + ball1.vy * ty;
                const v2n = ball2.vx * nx + ball2.vy * ny;
                const v2t = ball2.vx * tx + ball2.vy * ty;
                
                // 计算碰撞后的法向速度分量（假设两个球质量相同）
                const v1nAfter = v2n;
                const v2nAfter = v1n;
                
                // 将速度分量转换回x和y分量
                ball1.vx = v1nAfter * nx + v1t * tx;
                ball1.vy = v1nAfter * ny + v1t * ty;
                ball2.vx = v2nAfter * nx + v2t * tx;
                ball2.vy = v2nAfter * ny + v2t * ty;
                
                // 应用碰撞阻尼
                ball1.vx *= COLLISION_DAMPING;
                ball1.vy *= COLLISION_DAMPING;
                ball2.vx *= COLLISION_DAMPING;
                ball2.vy *= COLLISION_DAMPING;
                
                // 分离重叠的球
                const overlap = 0.5 * (ball1.radius + ball2.radius - distance + 1);
                ball1.x -= overlap * nx;
                ball1.y -= overlap * ny;
                ball2.x += overlap * nx;
                ball2.y += overlap * ny;
            }
        }
    }
}

// 绘制球桌
function drawTable() {
    const { left, top, width, height } = gameState.tableBounds;
    
    // 绘制绿色台面
    ctx.fillStyle = '#006400';
    ctx.fillRect(left, top, width, height);
    
    // 绘制边框
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 5;
    ctx.strokeRect(left, top, width, height);
    
    // 绘制网纹图案
    ctx.fillStyle = 'rgba(0, 120, 0, 0.1)';
    const gridSize = 40;
    for (let x = left; x <= left + width; x += gridSize) {
        for (let y = top; y <= top + height; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 绘制球
function drawBalls() {
    gameState.balls.forEach(ball => {
        if (!ball.isPotted) {
            // 绘制球体
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            
            // 创建渐变使球看起来更立体
            const gradient = ctx.createRadialGradient(
                ball.x - ball.radius * 0.3, 
                ball.y - ball.radius * 0.3, 
                ball.radius * 0.1, 
                ball.x, 
                ball.y, 
                ball.radius
            );
            
            // 根据球的类型设置颜色
            if (ball.isCueBall) {
                // 白球 - 纯白色基础，增加高光效果
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                
                // 添加高光
                const cueBallGradient = ctx.createRadialGradient(
                    ball.x - ball.radius * 0.3, 
                    ball.y - ball.radius * 0.3, 
                    ball.radius * 0.1, 
                    ball.x, 
                    ball.y, 
                    ball.radius
                );
                cueBallGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                cueBallGradient.addColorStop(1, 'rgba(230, 230, 230, 0.2)');
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = cueBallGradient;
                ctx.fill();
            } else if (ball.type.number === 8) {
                // 黑八球 - 纯黑色基础
                ctx.fillStyle = '#000000';
                ctx.fill();
                
                // 添加高光
                const blackBallGradient = ctx.createRadialGradient(
                    ball.x - ball.radius * 0.3, 
                    ball.y - ball.radius * 0.3, 
                    ball.radius * 0.1, 
                    ball.x, 
                    ball.y, 
                    ball.radius
                );
                blackBallGradient.addColorStop(0, 'rgba(100, 100, 100, 0.5)');
                blackBallGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = blackBallGradient;
                ctx.fill();
            } else if (ball.type.type === 'stripes') {
                // 花色球
                // 先绘制底色
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                
                // 绘制条纹
                ctx.beginPath();
                ctx.ellipse(ball.x, ball.y, ball.radius * 0.9, ball.radius * 0.3, 0, 0, Math.PI * 2);
                ctx.fillStyle = ball.type.color;
                ctx.fill();
                
                // 重新创建渐变用于高光
                const stripeGradient = ctx.createRadialGradient(
                    ball.x - ball.radius * 0.3, 
                    ball.y - ball.radius * 0.3, 
                    ball.radius * 0.1, 
                    ball.x, 
                    ball.y, 
                    ball.radius
                );
                stripeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                stripeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = stripeGradient;
                ctx.fill();
            } else {
                // 纯色球
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(1, ball.type.color);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
            
            // 绘制球上的数字
            ctx.fillStyle = ball.type.number === 8 || (ball.type.type === 'solids' && ball.type.number !== 0) ? '#ffffff' : '#000000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(ball.type.number.toString(), ball.x, ball.y);
        }
    });
}

// 绘制球袋
function drawPockets() {
    gameState.pockets.forEach(pocket => {
        ctx.beginPath();
        ctx.arc(pocket.x, pocket.y, POCKET_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        // 添加阴影效果
        ctx.beginPath();
        ctx.arc(pocket.x, pocket.y, POCKET_RADIUS * 0.8, 0, Math.PI * 2);
        const pocketGradient = ctx.createRadialGradient(pocket.x, pocket.y, 0, pocket.x, pocket.y, POCKET_RADIUS * 0.8);
        pocketGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
        pocketGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = pocketGradient;
        ctx.fill();
    });
}

// 更新球的位置
function updateBalls() {
    gameState.balls.forEach(ball => {
        if (!ball.isPotted) {
            // 更新位置
            ball.x += ball.vx;
            ball.y += ball.vy;
            
            // 应用摩擦力减速
            ball.vx *= FRICTION;
            ball.vy *= FRICTION;
            
            // 如果速度非常小，停止移动
            if (Math.abs(ball.vx) < 0.01) ball.vx = 0;
            if (Math.abs(ball.vy) < 0.01) ball.vy = 0;
            
            // 检测与球桌边界的碰撞
            checkTableCollision(ball);
        }
    });
    
    // 检测球与球之间的碰撞
    checkBallCollisions();
}

// 检测球与球桌边界的碰撞
function checkTableCollision(ball) {
    const { left, top, right, bottom } = gameState.tableBounds;
    
    // 左右边界
    if (ball.x - ball.radius <= left) {
        ball.x = left + ball.radius;
        ball.vx = -ball.vx * COLLISION_DAMPING;
    } else if (ball.x + ball.radius >= right) {
        ball.x = right - ball.radius;
        ball.vx = -ball.vx * COLLISION_DAMPING;
    }
    
    // 上下边界
    if (ball.y - ball.radius <= top) {
        ball.y = top + ball.radius;
        ball.vy = -ball.vy * COLLISION_DAMPING;
    } else if (ball.y + ball.radius >= bottom) {
        ball.y = bottom - ball.radius;
        ball.vy = -ball.vy * COLLISION_DAMPING;
    }
}

// 检查是否有球在移动
function isAnyBallMoving() {
    return gameState.balls.some(ball => 
        !ball.isPotted && (Math.abs(ball.vx) > 0.01 || Math.abs(ball.vy) > 0.01)
    );
}

// 检查游戏是否结束
function checkGameOver() {
    // 如果已经判定游戏结束，不再检查
    if (gameState.isGameOver) return;
    
    // 检查是否所有球都已入袋
    const remainingBalls = gameState.balls.filter(ball => !ball.isPotted && !ball.isCueBall && ball.type.number !== 8);
    
    if (remainingBalls.length === 0 && !gameState.blackBallPotted) {
        // 只剩下黑八球，游戏继续，等待玩家打进黑八
        gameStatus.textContent = '只剩下黑八球！';
    }
}

// 结束游戏
function endGame(isWin, message) {
    gameState.isGameOver = true;
    
    // 更新游戏结束模态框
    gameOverTitle.textContent = isWin ? '恭喜获胜！' : '游戏结束';
    gameOverMessage.textContent = message;
    
    // 显示游戏结束模态框
    gameOverModal.classList.remove('hidden');
}

// 更新游戏状态信息
function updateGameStatus() {
    // 更新当前玩家信息
    if (gameState.playerType === null) {
        playerInfo.innerHTML = `当前玩家: <span id="currentPlayer">${gameState.currentPlayer === 'player1' ? '玩家1' : '玩家2'} (白球)</span>`;
    } else if (gameState.playerType === 'solids') {
        playerInfo.innerHTML = `当前玩家: <span id="currentPlayer" class="text-ballYellow">${gameState.currentPlayer === 'player1' ? '玩家1' : '玩家2'} (全色球)</span>`;
    } else {
        playerInfo.innerHTML = `当前玩家: <span id="currentPlayer" class="text-ballBlue">${gameState.currentPlayer === 'player1' ? '玩家1' : '玩家2'} (花色球)</span>`;
    }
    
    // 更新游戏状态文本
    if (gameState.isGameOver) {
        gameStatus.textContent = '游戏结束';
    } else if (!gameState.gameStarted) {
        gameStatus.textContent = '准备就绪，点击白球开始瞄准';
    } else if (gameState.isFreeBall) {
        gameStatus.textContent = '自由球！点击任意位置放置白球';
    } else if (isAnyBallMoving()) {
        gameStatus.textContent = '球在移动中...';
    } else {
        gameStatus.textContent = `轮到${gameState.currentPlayer === 'player1' ? '玩家1' : '玩家2'}击球`;
    }
}

// 重启游戏
function restartGame() {
    // 隐藏所有模态框
    helpModal.classList.add('hidden');
    gameOverModal.classList.add('hidden');
    
    // 重置游戏状态
    gameState = {
        balls: [],
        pockets: [],
        tableBounds: {},
        cueBall: null,
        isAiming: false,
        aimStart: { x: 0, y: 0 },
        aimEnd: { x: 0, y: 0 },
        currentPlayer: 'player1',
        gameStarted: false,
        playerType: null,
        solidsPotted: 0,
        stripesPotted: 0,
        blackBallPotted: false,
        isGameOver: false,
        isFreeBall: false,
        playerStats: {
            player1: {
                type: null,
                score: 0
            },
            player2: {
                type: null,
                score: 0
            }
        }
    };
    
    // 重新初始化游戏
    initTable();
    initBalls();
    initPockets();
    
    // 更新游戏状态信息
    updateGameStatus();
}

// 当页面加载完成后初始化游戏
window.addEventListener('load', initGame);

// 游戏循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制游戏元素
    drawTable();
    drawPockets();
    drawBalls();
    
    // 如果球在移动，更新球的位置
    if (isAnyBallMoving()) {
        updateBalls();
        checkPockets();
        
        // 当所有球停止移动后检查游戏状态
        if (!isAnyBallMoving()) {
            // 检查是否应该切换玩家（如果没有打进自己类型的球）
            const pottedBalls = gameState.balls.filter(ball => ball.isPotted);
            const lastPottedBall = pottedBalls[pottedBalls.length - 1];
            
            if (lastPottedBall) {
                // 检查是否需要切换玩家
                if (!lastPottedBall.isCueBall && lastPottedBall.type.number !== 8) {
                    if ((gameState.playerType === 'solids' && lastPottedBall.type.type !== 'solids') ||
                        (gameState.playerType === 'stripes' && lastPottedBall.type.type !== 'stripes')) {
                        // 没有打进自己类型的球，切换玩家
                        gameState.currentPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
                    }
                }
            }
            
            updateGameStatus();
        }
    }
    
    // 检查游戏是否结束
    checkGameOver();
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}