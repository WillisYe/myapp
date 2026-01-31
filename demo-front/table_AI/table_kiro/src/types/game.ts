export type GameState = 'waiting' | 'playing' | 'paused' | 'finished'

export type Player = 'player1' | 'player2'

export type BallType = 'solid' | 'stripe' | 'eight' | 'cue'

export interface Ball {
  id: number
  type: BallType
  color: string
  position: { x: number; y: number; z: number }
  velocity: { x: number; y: number; z: number }
  pocketed: boolean
}

export interface GameConfig {
  tableWidth: number
  tableHeight: number
  ballRadius: number
  pocketRadius: number
  friction: number
  restitution: number
}

export interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

export interface GameEvents {
  stateChange: (state: GameState) => void
  playerChange: (player: Player) => void
  ballPocketed: (ball: Ball) => void
  loadingProgress: (progress: number) => void
  gameOver: (winner: Player) => void
  [key: string]: (...args: any[]) => void
}