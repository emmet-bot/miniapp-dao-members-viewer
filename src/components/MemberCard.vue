<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MemberData } from '../composables/useMembers'
import { CHAIN_NAMES } from '../lib/constants'
import PermissionBadge from './PermissionBadge.vue'

const props = defineProps<{
  member: MemberData
}>()

const expanded = ref(false)
const hasDetails = computed(
  () => props.member.allowedCalls.length > 0 || props.member.allowedDataKeys.length > 0
)

const explorerUrl = computed(
  () => `https://universaleverything.io/${props.member.address}`
)

const shortAddress = computed(() => {
  const addr = props.member.address
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
})

const profileImageUrl = computed(() => {
  return props.member.profile?.profileImage || props.member.blockieUrl
})

const displayName = computed(() => {
  return props.member.profile?.name || null
})

function truncateHex(hex: string, chars = 8): string {
  if (hex.length <= chars * 2 + 2) return hex
  return `${hex.slice(0, chars + 2)}...${hex.slice(-chars)}`
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
    <!-- Profile row -->
    <div class="flex items-center gap-3 mb-3">
      <div class="relative flex-shrink-0">
        <lukso-profile
          :profile-url="profileImageUrl"
          :profile-address="member.address"
          has-identicon
          size="medium"
        ></lukso-profile>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <template v-if="displayName">
            <lukso-username
              :name="displayName"
              :address="member.address"
              prefix="@"
              size="small"
            ></lukso-username>
          </template>
          <template v-else>
            <a
              :href="explorerUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-mono text-neutral-700 dark:text-neutral-300 hover:text-lukso-pink transition-colors truncate"
            >
              {{ shortAddress }}
            </a>
          </template>
        </div>
        <div class="flex items-center gap-1.5 mt-0.5">
          <span
            class="text-[10px] px-1.5 py-0.5 rounded font-medium"
            :class="member.isContract
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'"
          >
            {{ member.isContract ? 'Contract' : 'EOA' }}
          </span>
          <!-- Chain badges -->
          <span
            v-for="cid in member.chains"
            :key="cid"
            class="text-[10px] px-1.5 py-0.5 rounded font-medium"
            :class="cid === 42
              ? 'bg-lukso-pink/10 text-lukso-pink'
              : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'"
          >
            {{ CHAIN_NAMES[cid] || `Chain ${cid}` }}
          </span>
          <a
            :href="explorerUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 hover:text-lukso-pink transition-colors"
          >
            {{ shortAddress }}
          </a>
        </div>
      </div>
    </div>

    <!-- Permissions -->
    <div v-if="member.permissions.length" class="flex flex-wrap gap-1 mb-2">
      <PermissionBadge
        v-for="perm in member.permissions"
        :key="perm"
        :permission="perm"
      />
    </div>
    <p v-else class="text-xs text-neutral-400 dark:text-neutral-600 mb-2">
      No permissions set
    </p>

    <!-- Expand toggle -->
    <button
      v-if="hasDetails"
      @click="expanded = !expanded"
      class="text-xs text-neutral-500 dark:text-neutral-400 hover:text-lukso-pink dark:hover:text-lukso-pink transition-colors flex items-center gap-1"
    >
      <svg
        class="w-3 h-3 transition-transform"
        :class="{ 'rotate-90': expanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      {{ expanded ? 'Hide' : 'Show' }} details
    </button>

    <!-- Expanded details -->
    <div v-if="expanded" class="mt-3 space-y-3">
      <!-- Allowed Calls -->
      <div v-if="member.allowedCalls.length">
        <h4 class="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
          Allowed Calls
        </h4>
        <div class="space-y-1.5">
          <div
            v-for="(call, idx) in member.allowedCalls"
            :key="idx"
            class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2 text-[11px]"
          >
            <div class="flex flex-wrap gap-1 mb-1">
              <span
                v-for="ct in call.callTypes"
                :key="ct"
                class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
              >
                {{ ct }}
              </span>
            </div>
            <div class="font-mono text-neutral-600 dark:text-neutral-400 space-y-0.5">
              <div>
                <span class="text-neutral-400 dark:text-neutral-500">To: </span>
                {{ call.isAnyAddress ? 'Any Address' : truncateHex(call.address) }}
              </div>
              <div>
                <span class="text-neutral-400 dark:text-neutral-500">Interface: </span>
                {{ call.isAnyInterface ? 'Any' : call.interfaceId }}
              </div>
              <div>
                <span class="text-neutral-400 dark:text-neutral-500">Function: </span>
                {{ call.isAnyFunction ? 'Any' : call.functionSelector }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Allowed Data Keys -->
      <div v-if="member.allowedDataKeys.length">
        <h4 class="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
          Allowed ERC725Y Data Keys
        </h4>
        <div class="space-y-1">
          <div
            v-for="(key, idx) in member.allowedDataKeys"
            :key="idx"
            class="bg-neutral-50 dark:bg-neutral-800 rounded-lg px-2 py-1.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 break-all"
          >
            {{ key }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
