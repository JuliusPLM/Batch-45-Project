<template>
  <div>
    Another Page {{ $route.params.id }} {{ $route.params.user }}
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.params)
</script>