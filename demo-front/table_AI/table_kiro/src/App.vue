<template>
  <div id="app" class="relative w-full h-full">
    <!-- 2D游戏画布 -->
    <canvas
      ref="gameCanvas"
      class="absolute inset-0 w-full h-full bg-gray-900"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
    />

    <!-- 游戏UI界面 -->
    <GameUI
      :game-state="gameState"
      :current-player="currentPlayer"
      :power="power"
      :is-aiming="isAiming"
      @restart="restartGame"
      @pause="togglePause"
      @rules-toggle="toggleRules"
    />

    <!-- 规则面板 -->
    <RulesPanel v-if="showRules" @close="toggleRules" />

    <!-- 加载界面 -->
    <LoadingScreen v-if="isLoading" :progress="loadingProgress" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import GameUI from './components/GameUI.vue'
import RulesPanel from './components/RulesPanel.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import { PoolGame2D } from './game/PoolGame2D'
import type { GameState, Player } from './types/game'

// 响应式数据
const gameCanvas = ref<HTMLCanvasElement>()
const isLoading = ref(true)
const loadingProgress = ref(0)
const showRules = ref(false)
const gameState = ref<GameState>('waiting')
const currentPlayer = ref<Player>('player1')
const power = ref(0)
const isAiming = ref(false)

// 游戏实例
let game: PoolGame2D | null = null

// 触摸和鼠标事件处理
const onTouchStart = (e: TouchEvent) => {
  e.preventDefault()
  if (game && e.touches.length === 1) {
    const touch = e.touches[0]
    game.handlePointerStart(touch.clientX, touch.clientY)
    isAiming.value = true
  }
}

const onTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  if (game && e.touches.length === 1 && isAiming.value) {
    const touch = e.touches[0]
    game.handlePointerMove(touch.clientX, touch.clientY)
  }
}

const onTouchEnd = (e: TouchEvent) => {
  e.preventDefault()
  if (game && isAiming.value) {
    game.handlePointerEnd()
    isAiming.value = false
  }
}

const onMouseDown = (e: MouseEvent) => {
  if (game) {
    game.handlePointerStart(e.clientX, e.clientY)
    isAiming.value = true
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (game && isAiming.value) {
    game.handlePointerMove(e.clientX, e.clientY)
  }
}

const onMouseUp = () => {
  if (game && isAiming.value) {
    game.handlePointerEnd()
    isAiming.value = false
  }
}

// 游戏控制方法
const restartGame = () => {
  game?.restart()
}

const togglePause = () => {
  game?.togglePause()
}

const toggleRules = () => {
  showRules.value = !showRules.value
}

// 初始化游戏
const initGame = async () => {
  if (!gameCanvas.value) return

  try {
    game = new PoolGame2D(gameCanvas.value)

    // 监听游戏事件
    game.on('stateChange', (state: GameState) => {
      gameState.value = state
    })

    game.on('playerChange', (player: Player) => {
      currentPlayer.value = player
    })

    game.on('loadingProgress', (progress: number) => {
      loadingProgress.value = progress
    })

    game.on('powerChange', (newPower: number) => {
      power.value = newPower
    })

    // 初始化游戏
    await game.init()

    isLoading.value = false
  } catch (error) {
    console.error('游戏初始化失败:', error)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (game) {
    game.handleResize()
  }
}

onMounted(() => {
  initGame()
  window.addEventListener('resize', handleResize)

  // 阻止默认的触摸行为
  document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  game?.dispose()
})
</script>