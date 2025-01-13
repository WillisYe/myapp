<script setup lim>
let value = 'Hello';
</script>
<template>
  <input v-model="value"/>
  <div> Binding value is {{value}}</div>
</template>