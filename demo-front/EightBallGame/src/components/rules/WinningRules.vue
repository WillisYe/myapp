<script setup lim>
const winningConditions = [
  '合法打进所有自己的球组后，合法打进8号球',
  '对手犯规打进8号球',
  '对手在未打完自己所有球时打进8号球',
];

const losingConditions = [
  '提前打进8号球',
  '打8号球时犯规',
  '8号球和白球同时落袋',
];
</script>

<template>
  <div class="rules-section">
    <h2>胜负判定</h2>
    <div class="winning">
      <h3>获胜条件：</h3>
      <ul>
        <li v-for="condition in winningConditions">{{ condition }}</li>
      </ul>
    </div>
    <div class="losing">
      <h3>失败条件：</h3>
      <ul>
        <li v-for="condition in losingConditions">{{ condition }}</li>
      </ul>
    </div>
  </div>
</template>