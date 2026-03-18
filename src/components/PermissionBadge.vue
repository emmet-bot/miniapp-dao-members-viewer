<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  permission: string
}>()

const colorClass = computed(() => {
  const p = props.permission.toLowerCase()
  if (p.includes('owner')) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  if (p.includes('super')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  if (p.includes('controller') || p.includes('permission')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  if (p.includes('call') || p.includes('delegate')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  if (p.includes('data') || p.includes('set')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (p.includes('transfer') || p.includes('value')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  if (p.includes('sign') || p.includes('encrypt') || p.includes('decrypt')) return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
  return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
})
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium leading-tight"
    :class="colorClass"
  >
    {{ permission }}
  </span>
</template>
