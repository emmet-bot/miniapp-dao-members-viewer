<template>
  <div class="space-y-4">
    <!-- Header skeleton -->
    <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div class="flex-1 space-y-2">
          <div class="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-48 animate-pulse" />
          <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-32 animate-pulse" />
        </div>
      </div>
    </div>
    <!-- Card skeletons -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-28 animate-pulse" />
            <div class="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-20 animate-pulse" />
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          <div
            v-for="j in 4"
            :key="j"
            class="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse"
            :style="{ width: `${50 + Math.random() * 40}px` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
