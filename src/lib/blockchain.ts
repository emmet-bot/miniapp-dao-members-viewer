import ERC725, { ERC725JSONSchema } from '@erc725/erc725.js'
import { createPublicClient, http, type PublicClient } from 'viem'
import { RPC_URLS, IPFS_GATEWAY } from './constants'

const LSP6_SCHEMA: ERC725JSONSchema[] = [
  {
    name: 'AddressPermissions[]',
    key: '0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3',
    keyType: 'Array',
    valueType: 'address',
    valueContent: 'Address',
  },
  {
    name: 'AddressPermissions:Permissions:<address>',
    key: '0x4b80742de2bf393a64c70000<address>',
    keyType: 'MappingWithGrouping',
    valueType: 'bytes32',
    valueContent: 'BitArray',
  },
  {
    name: 'AddressPermissions:AllowedCalls:<address>',
    key: '0x4b80742de2bf866c29110000<address>',
    keyType: 'MappingWithGrouping',
    valueType: '(bytes4,address,bytes4,bytes4)[CompactBytesArray]',
    valueContent: '(BitArray,Address,Bytes4,Bytes4)',
  },
  {
    name: 'AddressPermissions:AllowedERC725YDataKeys:<address>',
    key: '0x4b80742de2bf90b8b4850000<address>',
    keyType: 'MappingWithGrouping',
    valueType: 'bytes[CompactBytesArray]',
    valueContent: 'Bytes',
  },
]

const LSP3_SCHEMA: ERC725JSONSchema[] = [
  {
    name: 'LSP3Profile',
    key: '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
    keyType: 'Singleton',
    valueType: 'bytes',
    valueContent: 'VerifiableURI',
  },
]

export function createERC725(
  schemas: ERC725JSONSchema[],
  address: string,
  chainId: number
) {
  return new ERC725(schemas, address, RPC_URLS[chainId], {
    ipfsGateway: IPFS_GATEWAY,
  })
}

// Get controller addresses using erc725.js
export async function getControllerAddresses(
  upAddress: string,
  chainId: number
): Promise<string[]> {
  const erc725 = createERC725(LSP6_SCHEMA, upAddress, chainId)
  const result = await erc725.getData('AddressPermissions[]')
  return (result?.value as string[]) || []
}

// Get permissions for a controller
export async function getPermissions(
  upAddress: string,
  chainId: number,
  controllerAddress: string
): Promise<string | null> {
  const erc725 = createERC725(LSP6_SCHEMA, upAddress, chainId)
  const result = await erc725.getData({
    keyName: 'AddressPermissions:Permissions:<address>',
    dynamicKeyParts: controllerAddress,
  })
  return (result?.value as string) || null
}

// Decode permissions using ERC725.decodePermissions()
export function decodePermissionsFromHex(
  permissionsHex: string
): Record<string, boolean> {
  return ERC725.decodePermissions(permissionsHex as `0x${string}`)
}

// Get allowed calls
export async function getAllowedCalls(
  upAddress: string,
  chainId: number,
  controllerAddress: string
): Promise<any> {
  const erc725 = createERC725(LSP6_SCHEMA, upAddress, chainId)
  const result = await erc725.getData({
    keyName: 'AddressPermissions:AllowedCalls:<address>',
    dynamicKeyParts: controllerAddress,
  })
  return result?.value || null
}

// Get allowed data keys
export async function getAllowedERC725YDataKeys(
  upAddress: string,
  chainId: number,
  controllerAddress: string
): Promise<any> {
  const erc725 = createERC725(LSP6_SCHEMA, upAddress, chainId)
  const result = await erc725.getData({
    keyName: 'AddressPermissions:AllowedERC725YDataKeys:<address>',
    dynamicKeyParts: controllerAddress,
  })
  return result?.value || null
}

// Fetch LSP3 profile data (auto-decodes VerifiableURI and fetches JSON)
export async function fetchLSP3Profile(
  address: string,
  chainId: number
): Promise<any> {
  const erc725 = createERC725(LSP3_SCHEMA, address, chainId)
  try {
    const result = await erc725.fetchData('LSP3Profile')
    return result?.value || null
  } catch {
    return null
  }
}

// Keep viem only for isContract check
const clients = new Map<number, PublicClient>()

function getClient(chainId: number): PublicClient {
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

export async function isContract(
  address: string,
  chainId: number
): Promise<boolean> {
  try {
    const client = getClient(chainId)
    const code = await client.getCode({
      address: address as `0x${string}`,
    })
    return !!code && code !== '0x'
  } catch {
    return false
  }
}
