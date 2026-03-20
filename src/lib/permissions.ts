import { decodePermissionsFromHex } from './blockchain'
import { PERMISSION_LABELS, CALL_TYPES } from './constants'

export function decodePermissions(permissionsHex: string): string[] {
  const decoded = decodePermissionsFromHex(permissionsHex)
  const result: string[] = []
  for (const [key, active] of Object.entries(decoded)) {
    if (active && key !== 'ALL_PERMISSIONS') {
      result.push(PERMISSION_LABELS[key] || key)
    }
  }
  return result
}

export interface DecodedAllowedCall {
  callTypes: string[]
  address: string
  interfaceId: string
  functionSelector: string
  isAnyAddress: boolean
  isAnyFunction: boolean
  isAnyInterface: boolean
}

/**
 * Parse AllowedCalls value from erc725.js.
 * erc725.js may return:
 * - An array of decoded tuples: [{ callTypes, address, interfaceId, functionSelector }]
 * - A raw hex string (CompactBytesArray)
 * - null
 */
export function parseAllowedCalls(value: any): DecodedAllowedCall[] {
  if (!value) return []

  // If erc725.js returned a decoded array of tuples
  if (Array.isArray(value)) {
    return value.map((entry: any) => {
      // erc725.js decoded tuple format
      if (typeof entry === 'object' && !Array.isArray(entry)) {
        const callTypesHex = entry.callTypes || entry[0] || '0x00000000'
        const addr = entry.address || entry[1] || '0x' + '0'.repeat(40)
        const iface = entry.interfaceId || entry[2] || '0xffffffff'
        const func = entry.functionSelector || entry[3] || '0xffffffff'

        return {
          callTypes: decodeCallTypes(callTypesHex),
          address: addr.toLowerCase(),
          interfaceId: iface,
          functionSelector: func,
          isAnyAddress: addr.toLowerCase() === '0x' + 'f'.repeat(40),
          isAnyFunction: func === '0xffffffff',
          isAnyInterface: iface === '0xffffffff',
        }
      }
      return null
    }).filter(Boolean) as DecodedAllowedCall[]
  }

  // If it's a raw hex string, decode CompactBytesArray manually
  if (typeof value === 'string' && value.startsWith('0x')) {
    return decodeAllowedCallsHex(value)
  }

  return []
}

function decodeCallTypes(hexOrValue: string | number): string[] {
  const val = typeof hexOrValue === 'string'
    ? parseInt(hexOrValue.replace('0x', ''), 16)
    : hexOrValue
  const types: string[] = []
  for (const [bit, name] of Object.entries(CALL_TYPES)) {
    if (val & Number(bit)) types.push(name)
  }
  return types
}

function decodeAllowedCallsHex(hex: string): DecodedAllowedCall[] {
  const data = hex.startsWith('0x') ? hex.slice(2) : hex
  const results: DecodedAllowedCall[] = []
  let offset = 0

  while (offset < data.length) {
    if (offset + 4 > data.length) break
    const elementLength = parseInt(data.slice(offset, offset + 4), 16)
    offset += 4
    if (elementLength === 0 || offset + elementLength * 2 > data.length) break

    const element = data.slice(offset, offset + elementLength * 2)
    offset += elementLength * 2
    if (element.length < 64) continue

    const callTypesHex = element.slice(0, 8)
    const callTypeValue = parseInt(callTypesHex, 16)
    const callTypes: string[] = []
    for (const [bit, name] of Object.entries(CALL_TYPES)) {
      if (callTypeValue & Number(bit)) callTypes.push(name)
    }

    const address = '0x' + element.slice(8, 48)
    const interfaceId = '0x' + element.slice(48, 56)
    const functionSelector = '0x' + element.slice(56, 64)

    results.push({
      callTypes,
      address,
      interfaceId,
      functionSelector,
      isAnyAddress: address === '0x' + 'f'.repeat(40),
      isAnyFunction: functionSelector === '0xffffffff',
      isAnyInterface: interfaceId === '0xffffffff',
    })
  }

  return results
}

/**
 * Parse AllowedERC725YDataKeys value from erc725.js.
 * May return decoded array of hex strings or raw CompactBytesArray hex.
 */
export function parseAllowedDataKeys(value: any): string[] {
  if (!value) return []

  // Already an array of hex strings
  if (Array.isArray(value)) {
    return value.filter((k: any) => typeof k === 'string')
  }

  // Raw hex CompactBytesArray
  if (typeof value === 'string' && value.startsWith('0x')) {
    return decodeAllowedDataKeysHex(value)
  }

  return []
}

function decodeAllowedDataKeysHex(hex: string): string[] {
  const data = hex.startsWith('0x') ? hex.slice(2) : hex
  const keys: string[] = []
  let offset = 0

  while (offset < data.length) {
    if (offset + 4 > data.length) break
    const elementLength = parseInt(data.slice(offset, offset + 4), 16)
    offset += 4
    if (elementLength === 0 || offset + elementLength * 2 > data.length) break

    const key = '0x' + data.slice(offset, offset + elementLength * 2)
    keys.push(key)
    offset += elementLength * 2
  }

  return keys
}
