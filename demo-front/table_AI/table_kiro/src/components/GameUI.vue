<template>
  <div class="game-ui">
    <!-- 顶部状态栏 -->
    <div class="absolute top-4 left-4 right-4 flex justify-between items-center safe-area-inset">
      <!-- 当前玩家 -->
      <div class="glass-panel px-4 py-2">
        <div class="text-white text-sm font-medium">
          {{ currentPlayer === 'player1' ? '玩家1' : '玩家2' }}
        </div>
        <div class="text-xs text-gray-300">
          {{ gameState === 'playing' ? '进行中' : gameState === 'paused' ? '暂停' : '等待中' }}
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex gap-2">
        <button
          @click="$emit('pause')"
          class="btn btn-icon glass-panel text-white"
          :class="{ 'bg-warning/20': gameState === 'paused' }"
        >
          {{ gameState === 'paused' ? '▶️' : '⏸️' }}
        </button>

        <button
          @click="$emit('rules-toggle')"
          class="btn btn-icon glass-panel text-white"
        >
          ❓
        </button>

        <button
          @click="$emit('restart')"
          class="btn btn-icon glass-panel text-white"
        >
          🔄
        </button>
      </div>
    </div>

    <!-- 底部控制面板 -->
    <div class="absolute bottom-4 left-4 right-4 safe-area-inset">
      <!-- 操作提示 -->
      <div v-if="!isAiming" class="glass-panel p-3 text-center">
        <div class="text-white text-sm">
          点击目标球或桌面确定击球方向
        </div>
        <div class="text-xs text-gray-400 mt-1">
          然后在右侧力度区滑动控制力度
        </div>
      </div>

      <!-- 瞄准状态提示 -->
      <div v-else class="glass-panel p-3 text-center">
        <div class="text-white text-sm">
          在右侧力度区上下滑动控制力度
        </div>
        <div class="text-xs text-gray-400 mt-1">
          松手击球 • 当前力度: {{ power }}%
        </div>
      </div>
    </div>

    <!-- 游戏结束面板 -->
    <div v-if="gameState === 'finished'" class="absolute inset-0 flex items-center justify-center bg-black/50">
      <div class="glass-panel p-8 text-center max-w-sm mx-4">
        <div class="text-2xl mb-4">🎉</div>
        <div class="text-white text-xl font-bold mb-2">游戏结束</div>
        <div class="text-gray-300 mb-6">
          {{ currentPlayer === 'player1' ? '玩家1' : '玩家2' }} 获胜！
        </div>
        <button @click="$emit('restart')" class="btn btn-primary w-full">
          再来一局
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameState, Player } from '../types/game'

interface Props {
  gameState: GameState
  currentPlayer: Player
  power: number
  isAiming: boolean
}

defineProps<Props>()

defineEmits<{
  restart: []
  pause: []
  'rules-toggle': []
}>()

const isMobile = computed(() => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
})
</script>

<style scoped>
/* 移除了滑块样式，因为不再使用力度滑块 */
</style>