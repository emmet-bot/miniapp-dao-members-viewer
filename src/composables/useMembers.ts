import { ref, watch, type Ref } from 'vue'
import {
  getControllerAddresses,
  getPermissions,
  getAllowedCalls,
  getAllowedERC725YDataKeys,
  isContract,
} from '../lib/blockchain'
import { fetchProfilesBatch, type ProfileData } from '../lib/profile'
import {
  decodePermissions,
  parseAllowedCalls,
  parseAllowedDataKeys,
  type DecodedAllowedCall,
} from '../lib/permissions'
import { getBlockie } from '../lib/identicon'

const SUPPORTED_CHAINS = [42, 4201, 1, 8453]

export interface MemberData {
  address: string
  isContract: boolean
  permissions: string[]
  permissionsRaw: string | null
  allowedCalls: DecodedAllowedCall[]
  allowedDataKeys: string[]
  profile: ProfileData | null
  blockieUrl: string
  chains: number[]
}

export interface UpProfileData {
  address: string
  chainId: number
  profile: ProfileData | null
  blockieUrl: string
  chains: number[]
}

export function useMembers(
  chainId: Ref<number>,
  address: Ref<string>
) {
  const members = ref<MemberData[]>([])
  const upProfile = ref<UpProfileData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMembers() {
    loading.value = true
    error.value = null
    members.value = []
    upProfile.value = null

    try {
      const upAddress = address.value

      // Fetch controllers from both chains in parallel
      const chainResults = await Promise.all(
        SUPPORTED_CHAINS.map(async (cid) => {
          try {
            const controllers = await getControllerAddresses(upAddress, cid)
            return { chainId: cid, controllers }
          } catch {
            return { chainId: cid, controllers: [] as string[] }
          }
        })
      )

      // Determine which chains the UP exists on
      const activeChains = chainResults
        .filter((r) => r.controllers.length > 0)
        .map((r) => r.chainId)

      if (activeChains.length === 0) {
        error.value = 'No controllers found on any chain for this address.'
        loading.value = false
        return
      }

      // Build a map of unique controllers -> which chains they appear on
      const controllerChainMap = new Map<string, number[]>()
      for (const { chainId: cid, controllers } of chainResults) {
        for (const addr of controllers) {
          const normalized = addr.toLowerCase()
          if (!controllerChainMap.has(normalized)) {
            controllerChainMap.set(normalized, [])
          }
          controllerChainMap.get(normalized)!.push(cid)
        }
      }

      const allAddresses = [upAddress, ...controllerChainMap.keys()]

      // Batch fetch all profiles from Envio (single request)
      const profiles = await fetchProfilesBatch(allAddresses)

      // Set UP profile
      const upProfileData = profiles[upAddress.toLowerCase()] || null
      upProfile.value = {
        address: upAddress,
        chainId: activeChains.includes(chainId.value) ? chainId.value : activeChains[0],
        profile: upProfileData,
        blockieUrl: getBlockie(upAddress),
        chains: activeChains,
      }

      // Fetch permission data for each unique controller
      const memberPromises = Array.from(controllerChainMap.entries()).map(
        async ([controllerAddr, chains]) => {
          const cid = chains.includes(chainId.value) ? chainId.value : chains[0]

          const [permissionsHex, allowedCallsValue, allowedDataKeysValue, contractCheck] =
            await Promise.all([
              getPermissions(upAddress, cid, controllerAddr).catch(() => null),
              getAllowedCalls(upAddress, cid, controllerAddr).catch(() => null),
              getAllowedERC725YDataKeys(upAddress, cid, controllerAddr).catch(() => null),
              isContract(controllerAddr, cid),
            ])

          const profile = profiles[controllerAddr] || null

          return {
            address: controllerAddr,
            isContract: contractCheck,
            permissions: permissionsHex ? decodePermissions(permissionsHex) : [],
            permissionsRaw: permissionsHex,
            allowedCalls: parseAllowedCalls(allowedCallsValue),
            allowedDataKeys: parseAllowedDataKeys(allowedDataKeysValue),
            profile,
            blockieUrl: getBlockie(controllerAddr),
            chains,
          } satisfies MemberData
        }
      )

      const allMembers = await Promise.all(memberPromises)

      // Sort: UPs with profiles first, then other contracts, then EOAs
      allMembers.sort((a, b) => {
        const scoreA = a.profile ? 0 : a.isContract ? 1 : 2
        const scoreB = b.profile ? 0 : b.isContract ? 1 : 2
        return scoreA - scoreB
      })

      members.value = allMembers
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch members'
    } finally {
      loading.value = false
    }
  }

  watch(
    [chainId, address],
    () => {
      if (address.value) fetchMembers()
    },
    { immediate: true }
  )

  return { members, upProfile, loading, error, refresh: fetchMembers }
}
