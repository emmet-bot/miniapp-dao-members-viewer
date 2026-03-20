import { ref, watch, type Ref } from 'vue'
import {
  getControllerAddresses,
  getPermissions,
  getAllowedCalls,
  getAllowedERC725YDataKeys,
  isContract,
} from '../lib/blockchain'
import { fetchProfileData, type ProfileData } from '../lib/profile'
import {
  decodePermissions,
  decodeAllowedCalls,
  decodeAllowedDataKeys,
  type DecodedAllowedCall,
} from '../lib/permissions'
import { getBlockie } from '../lib/identicon'

const SUPPORTED_CHAINS = [42, 4201]

export interface MemberData {
  address: string
  isContract: boolean
  permissions: string[]
  permissionsRaw: string | null
  allowedCalls: DecodedAllowedCall[]
  allowedCallsRaw: string | null
  allowedDataKeys: string[]
  allowedDataKeysRaw: string | null
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

async function fetchControllerData(
  upAddress: string,
  chainId: number,
  controllerAddr: string
): Promise<{
  permissionsHex: string | null
  allowedCallsRaw: string | null
  allowedDataKeysRaw: string | null
  contractCheck: boolean
}> {
  const [permissionsHex, allowedCallsRaw, allowedDataKeysRaw, contractCheck] =
    await Promise.all([
      getPermissions(upAddress, chainId, controllerAddr).catch(() => null),
      getAllowedCalls(upAddress, chainId, controllerAddr).catch(() => null),
      getAllowedERC725YDataKeys(upAddress, chainId, controllerAddr).catch(
        () => null
      ),
      isContract(controllerAddr, chainId),
    ])
  return { permissionsHex, allowedCallsRaw, allowedDataKeysRaw, contractCheck }
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

      // Fetch UP's own profile from the first active chain
      const profileChain = activeChains.includes(chainId.value)
        ? chainId.value
        : activeChains[0]
      const upProfileData = await fetchProfileData(upAddress, profileChain)
      upProfile.value = {
        address: upAddress,
        chainId: profileChain,
        profile: upProfileData,
        blockieUrl: getBlockie(upAddress),
        chains: activeChains,
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

      // Fetch data for each unique controller from its first available chain
      const memberPromises = Array.from(controllerChainMap.entries()).map(
        async ([controllerAddr, chains]) => {
          // Use the first chain this controller appears on for detailed data
          const cid = chains.includes(chainId.value)
            ? chainId.value
            : chains[0]

          const { permissionsHex, allowedCallsRaw, allowedDataKeysRaw, contractCheck } =
            await fetchControllerData(upAddress, cid, controllerAddr)

          let profile: ProfileData | null = null
          if (contractCheck) {
            profile = await fetchProfileData(controllerAddr, cid)
          }

          return {
            address: controllerAddr,
            isContract: contractCheck,
            permissions: permissionsHex
              ? decodePermissions(permissionsHex)
              : [],
            permissionsRaw: permissionsHex,
            allowedCalls: allowedCallsRaw
              ? decodeAllowedCalls(allowedCallsRaw as string)
              : [],
            allowedCallsRaw: allowedCallsRaw as string | null,
            allowedDataKeys: allowedDataKeysRaw
              ? decodeAllowedDataKeys(allowedDataKeysRaw as string)
              : [],
            allowedDataKeysRaw: allowedDataKeysRaw as string | null,
            profile,
            blockieUrl: getBlockie(controllerAddr),
            chains,
          } satisfies MemberData
        }
      )

      members.value = await Promise.all(memberPromises)
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
