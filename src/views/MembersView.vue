<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMembers } from '../composables/useMembers'
import ProfileHeader from '../components/ProfileHeader.vue'
import MemberCard from '../components/MemberCard.vue'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'

const route = useRoute()

const chainId = computed(() => Number(route.params.chainId) || 42)
const address = computed(() => (route.params.address as string) || '')

const { members, upProfile, loading, error } = useMembers(chainId, address)
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-6">
    <LoadingSkeleton v-if="loading" />

    <template v-else-if="error">
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 text-center">
        <p class="text-red-500 dark:text-red-400 font-medium">{{ error }}</p>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          Could not load controller data for this address.
        </p>
      </div>
    </template>

    <template v-else>
      <ProfileHeader
        v-if="upProfile"
        :up-profile="upProfile"
        :member-count="members.length"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MemberCard
          v-for="member in members"
          :key="member.address"
          :member="member"
          :chain-id="chainId"
        />
      </div>

      <p
        v-if="!members.length && !loading"
        class="text-center text-neutral-500 dark:text-neutral-400 py-12"
      >
        No controllers found for this address.
      </p>
    </template>
  </div>
</template>
