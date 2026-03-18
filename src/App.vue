<script setup lang="ts">
import { useDarkMode } from './composables/useDarkMode'

useDarkMode()
</script>

<template>
  <div class="min-h-screen bg-neutral-100 dark:bg-neutral-950 transition-colors">
    <router-view />
  </div>
</template>
