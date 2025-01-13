import Matter from 'matter-js';
import type { TableDimensions, GameState, Ball } from './types';
import { checkPocketCollision, handleBallPocketed } from './PocketManager';

export function checkGameRules(
  balls: Ball[],
  gameState: GameState,
  engine: Matter.Engine,
  hitBall: Ball | null,
  { tableWidth, tableHeight, ballRadius, POCKET_POSITIONS, pocketRadius, wallWidth, wallColor, TABLE_BOUNDS, whitePosition }: TableDimensions
): void {
  // 检查边界和入袋
  balls.forEach(ball => {
    if (!ball.pocketed) {
      // 检查入袋
      for (const pocket of POCKET_POSITIONS) {
        if (checkPocketCollision(ball.body, pocket, pocketRadius)) {
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
      }
    }
  });

  // 切换玩家回合
  if (!hitBall || hitBall.type === 'white') {
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
  }
}