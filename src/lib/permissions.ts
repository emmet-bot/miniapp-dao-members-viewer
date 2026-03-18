import { PERMISSIONS, PERMISSION_LABELS, CALL_TYPES } from './constants'

export function decodePermissions(permissionsHex: string): string[] {
  const value = BigInt(permissionsHex)
  const result: string[] = []
  for (const [key, bit] of Object.entries(PERMISSIONS)) {
    if (value & bit) {
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

export function decodeAllowedCalls(hex: string): DecodedAllowedCall[] {
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

    if (element.length < 64) continue // Need at least 32 bytes

    const callTypesHex = element.slice(0, 8)
    const callTypeValue = parseInt(callTypesHex, 16)
    const callTypes: string[] = []
    for (const [bit, name] of Object.entries(CALL_TYPES)) {
      if (callTypeValue & Number(bit)) {
        callTypes.push(name)
      }
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

export function decodeAllowedDataKeys(hex: string): string[] {
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
