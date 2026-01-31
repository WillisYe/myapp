<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
    <div class="glass-panel p-6 max-w-md mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-white text-xl font-bold">游戏规则</h2>
        <button @click="$emit('close')" class="text-white text-2xl hover:text-gray-300">
          ×
        </button>
      </div>

      <div class="text-gray-200 space-y-4 text-sm">
        <section>
          <h3 class="text-white font-semibold mb-2">🎯 游戏目标</h3>
          <p>先打完自己球组的所有球，再合法击入黑8球获胜。</p>
        </section>

        <section>
          <h3 class="text-white font-semibold mb-2">🎱 球组分配</h3>
          <ul class="space-y-1 ml-4">
            <li>• 实心球组：1-7号球</li>
            <li>• 花色球组：9-15号球</li>
            <li>• 黑8球：最后击入</li>
            <li>• 白球：母球，用于击打其他球</li>
          </ul>
        </section>

        <section>
          <h3 class="text-white font-semibold mb-2">📱 操作方法</h3>
          <ul class="space-y-1 ml-4">
            <li>• <strong>第一步</strong>：点击目标球或桌面确定击球方向</li>
            <li>• <strong>第二步</strong>：在右侧蓝色力度区上下滑动控制力度</li>
            <li>• <strong>击球</strong>：松开手指完成击球</li>
            <li>• 也可以拖动屏幕来调整瞄准方向</li>
          </ul>
        </section>

        <section>
          <h3 class="text-white font-semibold mb-2">🎱 辅助功能</h3>
          <ul class="space-y-1 ml-4">
            <li>• <strong>球杆显示</strong>：瞄准时自动显示球杆位置</li>
            <li>• <strong>轨迹预测</strong>：白色虚线显示白球运动路径</li>
            <li>• <strong>碰撞预测</strong>：橙色虚线显示目标球轨迹</li>
            <li>• <strong>碰撞点</strong>：红色圆点标记预期碰撞位置</li>
            <li>• <strong>力度区域</strong>：右侧蓝色区域显示当前力度</li>
            <li>• <strong>力度反馈</strong>：球杆距离反映击球力度</li>
          </ul>
        </section>

        <section>
          <h3 class="text-white font-semibold mb-2">🎯 轨迹说明</h3>
          <ul class="space-y-1 ml-4">
            <li>• <span class="text-white">白色虚线</span>：白球的完整运动轨迹</li>
            <li>• <span class="text-orange-400">橙色虚线</span>：目标球碰撞后的轨迹</li>
            <li>• <span class="text-red-400">红色圆点</span>：球与球的碰撞位置</li>
            <li>• <span class="text-red-300">红色光环</span>：碰撞点的强调标记</li>
            <li>• 轨迹会考虑桌边反弹和摩擦力</li>
            <li>• 轨迹透明度随距离递减</li>
          </ul>
        </section>

        <section>
          <h3 class="text-white font-semibold mb-2">⚠️ 犯规情况</h3>
          <ul class="space-y-1 ml-4">
            <li>• 白球进袋</li>
            <li>• 击打对方球组的球</li>
            <li>• 过早击打黑8球</li>
            <li>• 击球后没有球碰到边框</li>
          </ul>
        </section>

        <section>
          <h3 class="text-white font-semibold mb-2">🏆 获胜条件</h3>
          <ul class="space-y-1 ml-4">
            <li>• 打完自己球组后合法击入黑8球</li>
            <li>• 对方犯规导致黑8球进袋</li>
          </ul>
        </section>

        <section>
          <h3 class="text-white font-semibold mb-2">💡 游戏技巧</h3>
          <ul class="space-y-1 ml-4">
            <li>• 控制力度，避免白球进袋</li>
            <li>• 计算角度，利用反弹</li>
            <li>• 观察球的分布，制定策略</li>
            <li>• 防守时让对方难以击球</li>
            <li>• <strong>利用轨迹预测</strong>：观察白色虚线规划路线</li>
            <li>• <strong>注意碰撞点</strong>：红点显示最佳击球位置</li>
            <li>• <strong>预判目标球</strong>：橙色虚线显示目标球去向</li>
            <li>• <strong>精确力度控制</strong>：在右侧力度区精细调节</li>
            <li>• <strong>两步操作</strong>：先确定方向，再调整力度</li>
          </ul>
        </section>
      </div>

      <div class="mt-6 text-center">
        <button @click="$emit('close')" class="btn btn-primary px-8">
          开始游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineEmits<{
  close: []
}>()

const isMobile = computed(() => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
})
</script>