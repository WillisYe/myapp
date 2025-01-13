<script setup lim>
import BasicRules from './rules/BasicRules.vue';
import FoulRules from './rules/FoulRules.vue';
import WinningRules from './rules/WinningRules.vue';
</script>

<template>
  <div class="eight-ball-rules">
    <h1>台球8球规则说明</h1>
    <BasicRules />
    <FoulRules />
    <WinningRules />
  </div>
</template>

<style scoped>
.eight-ball-rules {
  margin: 0 auto;
  padding: 20px;
  color: #666;
}

.rules-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  color: #42b883;
  margin-bottom: 1rem;
}

h3 {
  color: #486491;
  margin-bottom: 0.5rem;
}

ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

li {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.winning, .losing {
  margin-top: 1rem;
}
</style>