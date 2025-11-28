<script setup lim>
const basicRules = [
  '比赛双方分别击打全色球(1-7号)和半色球(9-15号)',
  '必须先击打自己的球组，且击球有效(进球、碰库或过线)',
  '8号球必须在打完所有自己的球后才能击打',
  '犯规后对手获得自由球权',
];
</script>

<template>
  <div class="rules-section">
    <h2>基本规则</h2>
    <ul>
      <li v-for="rule in basicRules">{{ rule }}</li>
    </ul>
  </div>
</template>