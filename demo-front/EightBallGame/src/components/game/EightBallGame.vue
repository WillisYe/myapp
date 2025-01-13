<script setup lang="ts" lim>
  import { onMounted, onUnmounted } from 'vue';
  import Matter from 'matter-js';
  import { getGameOptions } from '../../game/getGameOptions';
  import { createTable } from '../../game/TableManager';
  import { createBalls } from '../../game/BallSetup';
  import { checkGameRules } from '../../game/GameLogic';
  import { setupPhysics } from '../../game/physics';
  import { createWalls } from '../../game/BoundaryManager';
  import { createPockets } from '../../game/PocketManager';
  import { CueStick } from '../../game/CueStick';
  import { checkPocketCollision, handleBallPocketed } from '../../game/PocketManager';
  import type { GameState, Ball } from '../../game/types';

  // 定义物理引擎和渲染器变量
  let engine: Matter.Engine;
  let render: Matter.Render;

  // 球列表，用于存储游戏中的所有球
  let balls: Ball[] = [];

  // 队尾球杆对象
  let cueStick: CueStick;

  // 游戏状态，包含当前玩家、玩家类型、游戏是否结束等信息
  let gameState: GameState = ({
    currentPlayer: 1,
    player1Type: null,
    player2Type: null,
    gameOver: false,
    winner: null,
  });

  console.log('%c gameState', 'color:red; background:yellow;')
  console.log(gameState)

  // 初始化游戏
  function setupGame() {
    // 设置物理引擎
    engine = setupPhysics();

    // 根据球桌宽度计算其它参数，球桌高度，边墙宽度，球袋半径，桌球半径等
    let gameOptions = getGameOptions();
    console.log('%c gameOptions', 'color:red; background:yellow;')
    console.log(gameOptions)

    // 创建渲染器并设置渲染参数
    render = Matter.Render.create({
      element: document.getElementById('game-canvas')!,
      engine: engine,
      options: {
        width: gameOptions.canvasWidth,
        height: gameOptions.tableHeight,
        wireframes: false,
        background: '#fff',
        hasBounds: true,  // 确保 bounds 处理正常
        showAngleIndicator: false,  // 显示角度指示器（可选）
      }
    });

    createTable(engine, gameOptions);

    // 创建边界墙
    var walls = createWalls(engine, gameOptions);

    // // 创建袋口
    var pockets = createPockets(engine, gameOptions);

    // 创建所有球
    balls = createBalls(engine, gameOptions);

    // 初始化队尾球杆
    cueStick = new CueStick(render, balls, walls, engine, gameOptions);

    // 启动物理引擎和渲染器
    Matter.Runner.run(engine);
    Matter.Render.run(render);


    // 每次渲染后更新队尾球杆位置
    Matter.Events.on(render, 'afterRender', () => {
      // 确保每次渲染后都调用 custom 方法
      engine.world.bodies.forEach((body: Matter.Body) => {
        if ((body as any).render?.custom) {
          const ctx = (render.context as unknown) as CanvasRenderingContext2D;
          (body as any).render.custom(ctx, body);
        }
      });

      var ballsMoving = [];
      var hitBall;
      for (const ball of balls) {
        if (ball.type === 'white') {
          hitBall = ball;
        }
        if (ball.body.speed < 0.2) {
          Matter.Body.setVelocity(ball.body, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(ball.body, 0);
        } else {
          ballsMoving.push(ball)
        }
      }

      // checkGameRules(balls, gameState, engine, hitBall, gameOptions);

      if (ballsMoving.length === 0) {
        cueStick.draw(hitBall);
      }

      const BallMoving = balls.find(ball => ball.body.speed);
      if (!BallMoving) {
        cueStick.startAiming(cueStick.angle)
      }
    });

    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        var pocekt, _ball;
        switch (true) {
          case bodyA.pocket:
            pocekt = bodyA;
            _ball = bodyB;
            break;
          case bodyB.pocket:
            pocekt = bodyB;
            _ball = bodyA;
            break;
          default:
            pocekt = void (0);
            _ball = void (0);
            break;
        }

        if (pocekt && _ball) {
          var ball = balls.find(b => b.body.id === _ball.id);
          var whitePosition = gameOptions.whitePosition;
          handleBallPocketed(ball, engine, whitePosition);

          // 如果白球进袋，重置位置
          if (ball.type === 'white') {
            ball.pocketed = false;
            Matter.Body.setPosition(ball.body, { x: whitePosition.x, y: whitePosition.y });
            Matter.Body.setVelocity(ball.body, { x: 0, y: 0 });
            Matter.World.add(engine.world, ball.body);
            gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
            return;
          }

          // 确定玩家球型
          if (!gameState.player1Type && ball.type !== 'black') {
            gameState.player1Type = ball.type;
            gameState.player2Type = ball.type === 'solid' ? 'stripe' : 'solid';
          }

          // 检查胜利条件
          if (ball.type === 'black') {
            gameState.gameOver = true;
            const currentPlayerBalls = balls.filter(
              b => b.type === (gameState.currentPlayer === 1 ? gameState.player1Type : gameState.player2Type)
            );
            if (currentPlayerBalls.every(b => b.pocketed)) {
              gameState.winner = gameState.currentPlayer;
            } else {
              gameState.winner = gameState.currentPlayer === 1 ? 2 : 1;
            }
          }
        }
      });

      // 切换玩家回合
      // gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    });
  }

  // 清理游戏资源
  function cleanup() {
    if (render) {
      Matter.Render.stop(render);
      render.canvas.remove();
    }
    if (engine) {
      Matter.Engine.clear(engine);
    }
  }

  function debounce(func: Function, wait: number) {
    let timeout: number;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 使用防抖优化的视口监听
  const debouncedResize = debounce(() => {
    cleanup();
    setupGame();
  }, 250);



  // 组件挂载时初始化游戏
  onMounted(() => {
    setupGame();
    window.addEventListener('resize', debouncedResize);
  });

  // 组件卸载时清理资源
  onUnmounted(() => {
    cleanup();
  });
</script>

<template>
  <div class="eight-ball-game">
    <!-- 显示游戏信息 -->
    <div class="game-info">
      <div class="player-info">
        <h2>当前玩家: {{ gameState.currentPlayer === 1 ? '玩家1' : '玩家2' }}</h2>
        <div v-if="gameState.player1Type" class="ball-types">
          <p>玩家1: {{ gameState.player1Type === 'solid' ? '全色球' : '半色球' }}</p>
          <p>玩家2: {{ gameState.player2Type === 'solid' ? '全色球' : '半色球' }}</p>
        </div>
      </div>
      <!-- 显示游戏结束信息 -->
      <div v-if="gameState.gameOver" class="game-over">
        <h2>游戏结束!</h2>
        <p>获胜者: 玩家{{ gameState.winner }}</p>
      </div>
    </div>
    <!-- 渲染游戏画布 -->
    <div id="game-canvas"></div>

  </div>
</template>

<style scoped>
  #game-canvas {
    display: flex;
    justify-content: center;
  }
</style>