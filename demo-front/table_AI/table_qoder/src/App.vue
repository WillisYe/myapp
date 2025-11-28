<template>
  <div id="app" class="game-container">
    <!-- 游戏标题 -->
    <header class="game-header">
      <h1 class="game-title">🎱 黑八桌球游戏</h1>
      <div class="game-info">
        <div class="player-info">
          <span class="current-player">当前玩家: {{ currentPlayer }}</span>
          <span class="game-status">{{ gameStatus }}</span>
          <span class="ball-groups" v-if="ballGroups.player1">
            玩家1: {{ ballGroups.player1 === 'solid' ? '实心球' : '花色球' }}
          </span>
          <span class="ball-groups" v-if="ballGroups.player2">
            玩家2: {{ ballGroups.player2 === 'solid' ? '实心球' : '花色球' }}
          </span>
        </div>
      </div>
    </header>

    <!-- 3D 游戏场景容器 -->
    <div ref="gameCanvas" class="game-canvas"></div>

    <!-- 游戏控制面板 -->
    <div class="control-panel">
      <div class="power-control">
        <label>击球力度:</label>
        <input
          type="range"
          v-model="shotPower"
          min="0"
          max="100"
          class="power-slider"
        />
        <span class="power-value">{{ shotPower }}%</span>
      </div>

      <div class="game-controls">
        <button @click="resetGame" class="control-btn reset-btn">重新开始</button>
        <button @click="togglePause" class="control-btn pause-btn">
          {{ isPaused ? '继续' : '暂停' }}
        </button>
        <button @click="toggleSound" class="control-btn sound-btn">
          {{ soundEnabled ? '音效开' : '音效关' }}
        </button>
        <button @click="showRules = true" class="control-btn rules-btn">
          玩法介绍
        </button>
      </div>
    </div>

    <!-- 游戏规则说明 -->
    <div class="rules-panel" v-if="showRules">
      <div class="rules-content">
        <div class="rules-header">
          <h2>🎱 黑八桌球游戏指南</h2>
          <button @click="showRules = false" class="close-rules">×</button>
        </div>

        <div class="rules-tabs">
          <button
            v-for="tab in ruleTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
          >
            {{ tab.name }}
          </button>
        </div>

        <div class="tab-content">
          <!-- 游戏目标 -->
          <div v-if="activeTab === 'objective'" class="tab-panel">
            <h3>🎯 游戏目标</h3>
            <div class="objective-content">
              <p>黑八桌球是一项技巧性很强的台球运动，游戏目标是：</p>
              <ul>
                <li><strong>第一步：</strong>确定你的球组（实心球1-7号 或 花色球9-15号）</li>
                <li><strong>第二步：</strong>击打完所有属于你的球组</li>
                <li><strong>第三步：</strong>最后击打8号黑球获得胜利</li>
              </ul>
              <div class="ball-groups">
                <div class="group solid">
                  <h4>实心球组 (1-7号)</h4>
                  <div class="balls">
                    <span class="ball" style="background: #ffff00;">1</span>
                    <span class="ball" style="background: #0000ff;">2</span>
                    <span class="ball" style="background: #ff0000;">3</span>
                    <span class="ball" style="background: #800080;">4</span>
                    <span class="ball" style="background: #ffa500;">5</span>
                    <span class="ball" style="background: #008000;">6</span>
                    <span class="ball" style="background: #800000;">7</span>
                  </div>
                </div>
                <div class="group stripe">
                  <h4>花色球组 (9-15号)</h4>
                  <div class="balls">
                    <span class="ball striped" style="background: linear-gradient(45deg, #ffff00 25%, white 25%, white 75%, #ffff00 75%);">9</span>
                    <span class="ball striped" style="background: linear-gradient(45deg, #0000ff 25%, white 25%, white 75%, #0000ff 75%);">10</span>
                    <span class="ball striped" style="background: linear-gradient(45deg, #ff0000 25%, white 25%, white 75%, #ff0000 75%);">11</span>
                    <span class="ball striped" style="background: linear-gradient(45deg, #800080 25%, white 25%, white 75%, #800080 75%);">12</span>
                    <span class="ball striped" style="background: linear-gradient(45deg, #ffa500 25%, white 25%, white 75%, #ffa500 75%);">13</span>
                    <span class="ball striped" style="background: linear-gradient(45deg, #008000 25%, white 25%, white 75%, #008000 75%);">14</span>
                    <span class="ball striped" style="background: linear-gradient(45deg, #800000 25%, white 25%, white 75%, #800000 75%);">15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 快速入门 -->
          <div v-if="activeTab === 'quickstart'" class="tab-panel">
            <h3>🚀 快速入门</h3>
            <div class="quickstart-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>开始游戏</h4>
                  <p>游戏开始时，白球位于右侧，其他球呈三角形摆放在左侧</p>
                  <p>玩家1先开球，通过击打白球来撞击其他球</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>瞄准击球</h4>
                  <p>移动鼠标来调整球杆方向</p>
                  <p>调整击球力度滑块（0-100%）</p>
                  <p>点击鼠标进行击球</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>确定球组</h4>
                  <p>开球后，根据第一个进袋的球确定你的目标球组</p>
                  <p>如果进的是实心球，你就是实心球组；如果是花色球，你就是花色球组</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>继续游戏</h4>
                  <p>轮流击球，努力将自己的球组全部打进袋中</p>
                  <p>完成自己的球组后，击打8号黑球获得胜利</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 游戏规则 -->
          <div v-if="activeTab === 'rules'" class="tab-panel">
            <h3>📋 详细规则</h3>
            <div class="rules-section">
              <h4>🎯 开球规则</h4>
              <ul>
                <li>开球玩家必须击打白球</li>
                <li>开球时至少有4个球触碰到台边，或有球进袋</li>
                <li>开球进球的玩家确定球组并继续击球</li>
                <li>如果开球犯规，对手可重新摆球开球</li>
              </ul>
            </div>

            <div class="rules-section">
              <h4>🎱 正常击球</h4>
              <ul>
                <li>必须首先击中自己的目标球</li>
                <li>击球后必须有球进袋或球触碰台边</li>
                <li>不能跳球（球离开台面后落回）</li>
                <li>击球完成自己目标球组后才能击打8号球</li>
              </ul>
            </div>

            <div class="rules-section">
              <h4>🏆 获胜条件</h4>
              <ul>
                <li>完成自己的目标球组后击入8号黑球</li>
                <li>对手过早击入8号球（未完成自己球组）</li>
                <li>对手击球时白球和8号球同时进袋</li>
                <li>对手在击打8号球时发生犯规</li>
              </ul>
            </div>

            <div class="rules-section">
              <h4>❌ 犯规情况</h4>
              <ul>
                <li><strong>白球进袋：</strong>击球后白球落入袋中</li>
                <li><strong>未击中目标：</strong>白球未首先接触自己的目标球</li>
                <li><strong>无球触边：</strong>击球后没有球触碰台边或进袋</li>
                <li><strong>跳球犯规：</strong>球跳出台面</li>
                <li><strong>击错目标：</strong>首先击中对手的球</li>
              </ul>
            </div>
          </div>

          <!-- 控制说明 -->
          <div v-if="activeTab === 'controls'" class="tab-panel">
            <h3>🎮 控制说明</h3>
            <div class="controls-section">
              <h4>🖱️ 鼠标操作</h4>
              <div class="control-item">
                <span class="control-key">鼠标移动</span>
                <span class="control-desc">调整球杆方向和瞄准</span>
              </div>
              <div class="control-item">
                <span class="control-key">鼠标点击</span>
                <span class="control-desc">执行击球动作</span>
              </div>
            </div>

            <div class="controls-section">
              <h4>⌨️ 键盘快捷键</h4>
              <div class="control-item">
                <span class="control-key">R 键</span>
                <span class="control-desc">打开/关闭规则面板</span>
              </div>
              <div class="control-item">
                <span class="control-key">空格键</span>
                <span class="control-desc">暂停/继续游戏</span>
              </div>
            </div>

            <div class="controls-section">
              <h4>🎛️ 游戏设置</h4>
              <div class="control-item">
                <span class="control-key">力度滑块</span>
                <span class="control-desc">调整击球力度 (0-100%)</span>
              </div>
              <div class="control-item">
                <span class="control-key">重新开始</span>
                <span class="control-desc">重置游戏到初始状态</span>
              </div>
              <div class="control-item">
                <span class="control-key">暂停/继续</span>
                <span class="control-desc">暂停或恢复游戏</span>
              </div>
              <div class="control-item">
                <span class="control-key">音效开关</span>
                <span class="control-desc">启用或禁用游戏音效</span>
              </div>
            </div>

            <div class="tips">
              <h4>💡 游戏技巧</h4>
              <ul>
                <li>开球时使用较大力度，确保球能充分散开</li>
                <li>瞄准时仔细观察球的路径和角度</li>
                <li>适当的力度控制能帮助白球停在理想位置</li>
                <li>观察台面情况，制定合理的击球策略</li>
                <li>保持耐心，精确瞄准比快速击球更重要</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import PoolGame from './components/PoolGame.js'

export default {
  name: 'App',
  setup() {
    const gameCanvas = ref(null)
    const shotPower = ref(50)
    const currentPlayer = ref('玩家 1')
    const gameStatus = ref('等待开球')
    const isPaused = ref(false)
    const showRules = ref(false)
    const activeTab = ref('objective')
    const ruleTabs = ref([
      { id: 'objective', name: '游戏目标' },
      { id: 'quickstart', name: '快速入门' },
      { id: 'rules', name: '游戏规则' },
      { id: 'controls', name: '控制说明' }
    ])
    const ballGroups = ref({
      player1: null,
      player2: null
    })
    const soundEnabled = ref(true)

    let poolGame = null

    const initGame = () => {
      if (gameCanvas.value) {
        poolGame = new PoolGame(gameCanvas.value)
        poolGame.init()

        // 监听游戏事件
        poolGame.on('playerChange', (player) => {
          currentPlayer.value = player === 0 ? '玩家 1' : '玩家 2'
        })

        poolGame.on('statusChange', (status) => {
          gameStatus.value = status
        })

        poolGame.on('groupAssigned', (groups) => {
          ballGroups.value = groups
        })
      }
    }

    const resetGame = () => {
      if (poolGame) {
        poolGame.reset()
        currentPlayer.value = '玩家 1'
        gameStatus.value = '等待开球'
        shotPower.value = 50
        ballGroups.value = {
          player1: null,
          player2: null
        }
      }
    }

    const togglePause = () => {
      isPaused.value = !isPaused.value
      if (poolGame) {
        if (isPaused.value) {
          poolGame.pause()
        } else {
          poolGame.resume()
        }
      }
    }

    const toggleSound = () => {
      soundEnabled.value = !soundEnabled.value
      if (poolGame && poolGame.soundManager) {
        poolGame.soundManager.setEnabled(soundEnabled.value)
      }
    }

    onMounted(() => {
      initGame()

      // 监听力度变化
      watch(shotPower, (newValue) => {
        if (poolGame) {
          poolGame.setShotPower(newValue / 100)
        }
      })

      // 监听键盘事件
      const handleKeyPress = (event) => {
        if (event.code === 'KeyR') {
          showRules.value = !showRules.value
        }
        if (event.code === 'Space') {
          event.preventDefault()
          togglePause()
        }
      }

      document.addEventListener('keydown', handleKeyPress)

      return () => {
        document.removeEventListener('keydown', handleKeyPress)
      }
    })

    onUnmounted(() => {
      if (poolGame) {
        poolGame.destroy()
      }
    })

    return {
      gameCanvas,
      shotPower,
      currentPlayer,
      gameStatus,
      isPaused,
      showRules,
      activeTab,
      ruleTabs,
      ballGroups,
      soundEnabled,
      resetGame,
      togglePause,
      toggleSound
    }
  }
}
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  overflow: hidden;
}

.game-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 20px;
  z-index: 100;
}

.game-title {
  font-size: 24px;
  margin: 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.game-info {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.player-info {
  display: flex;
  gap: 20px;
  font-size: 16px;
}

.current-player {
  color: #4CAF50;
  font-weight: bold;
}

.game-status {
  color: #FFC107;
}

.game-canvas {
  width: 100%;
  height: 100vh;
  cursor: crosshair;
}

.control-panel {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 30px;
  z-index: 100;
}

.power-control {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.power-slider {
  width: 150px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  outline: none;
}

.power-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #4CAF50;
  border-radius: 50%;
  cursor: pointer;
}

.power-value {
  color: #4CAF50;
  font-weight: bold;
  min-width: 40px;
}

.game-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.reset-btn {
  background: #f44336;
  color: white;
}

.reset-btn:hover {
  background: #d32f2f;
}

.pause-btn {
  background: #FF9800;
  color: white;
}

.pause-btn:hover {
  background: #F57C00;
}

.sound-btn {
  background: #9C27B0;
  color: white;
}

.sound-btn:hover {
  background: #7B1FA2;
}

.rules-btn {
  background: #2196F3;
  color: white;
}

.rules-btn:hover {
  background: #1976D2;
}

.rules-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.rules-content {
  background: white;
  border-radius: 15px;
  max-width: 900px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px 15px 0 0;
}

.rules-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.close-rules {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-rules:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.rules-tabs {
  display: flex;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: #e8e8e8;
  color: #333;
}

.tab-btn.active {
  background: white;
  color: #2196F3;
  border-bottom-color: #2196F3;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.tab-panel {
  padding: 30px;
  line-height: 1.6;
}

.tab-panel h3 {
  margin-top: 0;
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-panel h4 {
  color: #555;
  margin: 20px 0 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.objective-content p {
  margin-bottom: 15px;
  color: #666;
}

.objective-content ul {
  margin: 15px 0;
  padding-left: 20px;
}

.objective-content li {
  margin: 8px 0;
  color: #555;
}

.ball-groups {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.group {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.group h4 {
  margin: 0 0 10px;
  text-align: center;
  font-size: 14px;
  color: #495057;
}

.balls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.ball {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border: 2px solid #333;
  font-size: 12px;
}

.quickstart-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #2196F3;
}

.step-number {
  background: #2196F3;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 8px;
  color: #333;
  font-size: 16px;
}

.step-content p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.rules-section {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.rules-section h4 {
  margin: 0 0 12px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rules-section ul {
  margin: 0;
  padding-left: 20px;
}

.rules-section li {
  margin: 8px 0;
  color: #555;
}

.controls-section {
  margin-bottom: 25px;
}

.control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  margin: 8px 0;
  border-radius: 6px;
  border-left: 3px solid #FF9800;
}

.control-key {
  font-weight: bold;
  color: #333;
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.control-desc {
  color: #666;
  font-size: 14px;
}

.tips {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.tips h4 {
  margin: 0 0 12px;
  color: white;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-title {
    font-size: 20px;
  }

  .control-panel {
    flex-direction: column;
    gap: 15px;
  }

  .game-controls {
    justify-content: center;
  }
}
</style>