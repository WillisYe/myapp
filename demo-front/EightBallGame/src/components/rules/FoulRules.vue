<script setup lim>
const foulRules = [
  '击打对手的球组',
  '白球落袋或打出台面',
  '击球时未首先击中自己的球组',
  '击球后没有球接触库边或进袋',
  '击球时双脚离地',
];
</script>

<template>
  <div class="rules-section">
    <h2>犯规情况</h2>
    <ul>
      <li v-for="rule in foulRules">{{ rule }}</li>
    </ul>
  </div>
</template>