/**
 * 根据球桌的宽度，计算其它参数
 */
export function getGameOptions() {
  let windowWidth = document.documentElement.clientWidth;
  let canvasWidth = windowWidth * 0.9;
  let powerbarWidth = canvasWidth * 0.07;
  let tableWidth = canvasWidth * 0.9;
  let tableHeight = tableWidth * 2;
  let powerbarGapleft = canvasWidth - tableWidth - powerbarWidth;
  var wallWidth = (tableHeight * 0.06) / 2
  var pocketRadius = (tableHeight * 0.045) / 2
  var ballRadius = (tableHeight * 0.025) / 2
  var POCKET_POSITIONS = [
    { x: wallWidth, y: wallWidth }, // Left top    
    { x: tableWidth - wallWidth, y: wallWidth }, // Right top
    {
      x: (wallWidth - pocketRadius / 2 + 1),
      y: tableHeight / 2,
    }, // Center left
    {
      x: tableWidth - (wallWidth - pocketRadius / 2 + 1),
      y: tableHeight / 2,
    }, // Center right
    { x: wallWidth, y: tableHeight - wallWidth }, // Left bottom    
    { x: tableWidth - wallWidth, y: tableHeight - wallWidth }, // Right bottom]
  ]
  const TABLE_BOUNDS = {
    minX: wallWidth,  // 左边界
    maxX: tableWidth - wallWidth * 1, // 右边界
    minY: wallWidth,  // 上边界
    maxY: tableHeight - wallWidth * 1 // 下边界
  };
  const whitePosition = {
    x: tableWidth / 2,
    y: tableHeight / 5 * 4,
  }

  return {
    windowWidth,
    canvasWidth,
    powerbarWidth,
    powerbarGapleft,
    tableWidth,
    tableHeight,
    wallWidth,
    pocketRadius,
    ballRadius,
    POCKET_POSITIONS,
    wallColor: '#654321',
    tableColor: '#2c5530',
    TABLE_BOUNDS,
    whitePosition
  }
}
