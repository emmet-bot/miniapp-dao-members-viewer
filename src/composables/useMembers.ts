import { ref, watch, type Ref } from 'vue'
import type { Hex } from 'viem'
import {
  getClient,
  getControllerAddresses,
  getPermissions,
  getAllowedCalls,
  getAllowedERC725YDataKeys,
  isContract,
  getLSP3Data,
} from '../lib/blockchain'
import { fetchProfileData, type ProfileData } from '../lib/profile'
import {
  decodePermissions,
  decodeAllowedCalls,
  decodeAllowedDataKeys,
  type DecodedAllowedCall,
} from '../lib/permissions'
import { getBlockie } from '../lib/identicon'

export interface MemberData {
  address: Hex
  isContract: boolean
  permissions: string[]
  permissionsRaw: string | null
  allowedCalls: DecodedAllowedCall[]
  allowedCallsRaw: string | null
  allowedDataKeys: string[]
  allowedDataKeysRaw: string | null
  profile: ProfileData | null
  blockieUrl: string
}

export interface UpProfileData {
  address: Hex
  chainId: number
  profile: ProfileData | null
  blockieUrl: string
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
      const client = getClient(chainId.value)
      const upAddress = address.value as Hex

      // Fetch UP's own profile
      const upLsp3 = await getLSP3Data(client, upAddress)
      let upProfileData: ProfileData | null = null
      if (upLsp3) {
        upProfileData = await fetchProfileData(upLsp3)
      }
      upProfile.value = {
        address: upAddress,
        chainId: chainId.value,
        profile: upProfileData,
        blockieUrl: getBlockie(upAddress),
      }

      // Get controller addresses
      const controllers = await getControllerAddresses(client, upAddress)

      // Fetch all member data in parallel
      const memberPromises = controllers.map(async (controllerAddr) => {
        const [
          permissionsHex,
          allowedCallsHex,
          allowedDataKeysHex,
          contractCheck,
        ] = await Promise.all([
          getPermissions(client, upAddress, controllerAddr),
          getAllowedCalls(client, upAddress, controllerAddr),
          getAllowedERC725YDataKeys(client, upAddress, controllerAddr),
          isContract(client, controllerAddr),
        ])

        let profile: ProfileData | null = null
        if (contractCheck) {
          const lsp3 = await getLSP3Data(client, controllerAddr)
          if (lsp3) {
            profile = await fetchProfileData(lsp3)
          }
        }

        return {
          address: controllerAddr,
          isContract: contractCheck,
          permissions: permissionsHex
            ? decodePermissions(permissionsHex)
            : [],
          permissionsRaw: permissionsHex,
          allowedCalls: allowedCallsHex
            ? decodeAllowedCalls(allowedCallsHex)
            : [],
          allowedCallsRaw: allowedCallsHex,
          allowedDataKeys: allowedDataKeysHex
            ? decodeAllowedDataKeys(allowedDataKeysHex)
            : [],
          allowedDataKeysRaw: allowedDataKeysHex,
          profile,
          blockieUrl: getBlockie(controllerAddr),
        } satisfies MemberData
      })

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
