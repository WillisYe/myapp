<template>
  <div class="absolute inset-0 flex items-center justify-center bg-primary z-50">
    <div class="text-center">
      <!-- Logo -->
      <div class="text-6xl mb-4 animate-bounce-slow">🎱</div>

      <!-- 标题 -->
      <h1 class="text-white text-2xl font-bold mb-2">黑八桌球</h1>
      <p class="text-gray-400 text-sm mb-8">Kiro AI 开发</p>

      <!-- 加载进度 -->
      <div class="w-64 mx-auto">
        <div class="flex justify-between text-xs text-gray-400 mb-2">
          <span>加载中...</span>
          <span>{{ Math.round(progress) }}%</span>
        </div>

        <!-- 进度条 -->
        <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            class="bg-accent h-full rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <!-- 加载状态文字 -->
        <div class="text-xs text-gray-500 mt-3">
          {{ loadingText }}
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="mt-8 text-xs text-gray-500 max-w-xs mx-auto">
        <p class="mb-2">
          📱 专为移动端优化的2D桌球游戏
        </p>
        <p>
          🎯 2D物理引擎 • 触摸优先 • 竖屏布局
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  progress: number
}

const props = defineProps<Props>()

const isMobile = computed(() => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

const loadingText = computed(() => {
  const { progress } = props

  if (progress < 20) return '初始化游戏引擎...'
  if (progress < 40) return '加载音效系统...'
  if (progress < 60) return '创建桌球台...'
  if (progress < 80) return '生成球体...'
  if (progress < 95) return '设置游戏规则...'
  return '准备就绪...'
})
</script>