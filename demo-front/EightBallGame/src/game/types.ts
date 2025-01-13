// 定义桌台尺寸的类型
export interface TableDimensions {
  windowWidth: number,
  canvasWidth: number,
  powerbarWidth: number,
  powerbarGapleft: number,
  tableWidth: number,
  tableHeight: number,
  wallWidth: number,
  pocketRadius: number,
  ballRadius: number,
  POCKET_POSITIONS: TableDimension,
  wallColor: string,
  tableColor: string,
  TABLE_BOUNDS: TABLE_BOUND,
  whitePosition: TableDimension;
}

// 球袋
export interface TABLE_BOUND {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// 球袋
export interface TableDimension {
  x: number;
  y: number;
}

// 球的信息
export interface Ball {
  id: number;
  type: 'solid' | 'stripe' | 'white' | 'black';
  pocketed: boolean;
  body: any; // Matter.js body
}

// 游戏状态
export interface GameState {
  currentPlayer: 1 | 2;
  player1Type: 'solid' | 'stripe' | null;
  player2Type: 'solid' | 'stripe' | null;
  gameOver: boolean;
  winner: number | null;
}