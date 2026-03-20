<script setup lang="ts">
import { computed } from 'vue'
import type { UpProfileData } from '../composables/useMembers'
import { CHAIN_NAMES } from '../lib/constants'

const props = defineProps<{
  upProfile: UpProfileData
  memberCount: number
}>()

const explorerUrl = computed(() => `https://universaleverything.io/${props.upProfile.address}`)
const shortAddress = computed(() => {
  const addr = props.upProfile.address
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
})
</script>

<template>
  <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 mb-6">
    <div class="flex items-center gap-4">
      <div class="relative flex-shrink-0">
        <lukso-profile
          :profile-url="upProfile.profile?.profileImage || upProfile.blockieUrl"
          :profile-address="upProfile.address"
          has-identicon
          size="large"
        ></lukso-profile>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <h1 class="text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate">
            {{ upProfile.profile?.name || shortAddress }}
          </h1>
          <span
            v-for="cid in upProfile.chains"
            :key="cid"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="cid === 42
              ? 'bg-lukso-pink/10 text-lukso-pink'
              : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'"
          >
            {{ CHAIN_NAMES[cid] || `Chain ${cid}` }}
          </span>
        </div>
        <a
          :href="explorerUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-lukso-pink transition-colors font-mono"
        >
          {{ shortAddress }}
        </a>
        <p v-if="upProfile.profile?.description" class="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
          {{ upProfile.profile.description }}
        </p>
        <p class="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
          {{ memberCount }} controller{{ memberCount !== 1 ? 's' : '' }}
        </p>
      </div>
    </div>
  </div>
</template>
