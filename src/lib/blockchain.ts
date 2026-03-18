import { createPublicClient, http, type Hex, type PublicClient } from 'viem'
import { RPC_URLS, DATA_KEYS } from './constants'

const clients = new Map<number, PublicClient>()

export function getClient(chainId: number): PublicClient {
  if (!clients.has(chainId)) {
    const rpcUrl = RPC_URLS[chainId]
    if (!rpcUrl) throw new Error(`Unsupported chain: ${chainId}`)
    clients.set(
      chainId,
      createPublicClient({
        transport: http(rpcUrl),
      })
    )
  }
  return clients.get(chainId)!
}

export async function getData(
  client: PublicClient,
  address: Hex,
  key: Hex
): Promise<Hex | null> {
  try {
    const result = await client.call({
      to: address,
      data: `0x4e3e6e9c${key.slice(2).padStart(64, '0')}` as Hex,
    })
    if (!result.data || result.data === '0x') return null
    // Decode the ABI-encoded bytes response
    const data = result.data as Hex
    if (data.length < 130) return null
    // Skip the offset (32 bytes) and length (32 bytes), read the actual data
    const lengthHex = data.slice(66, 130)
    const length = parseInt(lengthHex, 16)
    if (length === 0) return null
    const value = ('0x' + data.slice(130, 130 + length * 2)) as Hex
    return value
  } catch {
    return null
  }
}

export async function getControllerAddresses(
  client: PublicClient,
  upAddress: Hex
): Promise<Hex[]> {
  const arrayLengthData = await getData(
    client,
    upAddress,
    DATA_KEYS.AddressPermissionsArray as Hex
  )
  if (!arrayLengthData) return []

  const count = parseInt(arrayLengthData.slice(2), 16)
  if (count === 0 || count > 1000) return []

  const addresses: Hex[] = []
  const baseKey = DATA_KEYS.AddressPermissionsArray.slice(0, 34)

  const promises = Array.from({ length: count }, (_, i) => {
    const indexHex = i.toString(16).padStart(32, '0')
    const elementKey = (baseKey + indexHex) as Hex
    return getData(client, upAddress, elementKey)
  })

  const results = await Promise.all(promises)
  for (const result of results) {
    if (result && result.length >= 42) {
      const addr = ('0x' + result.slice(-40).toLowerCase()) as Hex
      addresses.push(addr)
    }
  }

  return addresses
}

export async function getPermissions(
  client: PublicClient,
  upAddress: Hex,
  controllerAddress: Hex
): Promise<Hex | null> {
  const key = (DATA_KEYS.PermissionsPrefix +
    controllerAddress.slice(2).toLowerCase()) as Hex
  return getData(client, upAddress, key)
}

export async function getAllowedCalls(
  client: PublicClient,
  upAddress: Hex,
  controllerAddress: Hex
): Promise<Hex | null> {
  const key = (DATA_KEYS.AllowedCallsPrefix +
    controllerAddress.slice(2).toLowerCase()) as Hex
  return getData(client, upAddress, key)
}

export async function getAllowedERC725YDataKeys(
  client: PublicClient,
  upAddress: Hex,
  controllerAddress: Hex
): Promise<Hex | null> {
  const key = (DATA_KEYS.AllowedERC725YDataKeysPrefix +
    controllerAddress.slice(2).toLowerCase()) as Hex
  return getData(client, upAddress, key)
}

export async function isContract(
  client: PublicClient,
  address: Hex
): Promise<boolean> {
  try {
    const code = await client.getCode({ address })
    return !!code && code !== '0x'
  } catch {
    return false
  }
}

export async function getLSP3Data(
  client: PublicClient,
  address: Hex
): Promise<Hex | null> {
  return getData(client, address, DATA_KEYS.LSP3Profile as Hex)
}
