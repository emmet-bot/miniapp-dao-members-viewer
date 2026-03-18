import makeBlockie from 'ethereum-blockies-base64'

export function getBlockie(address: string): string {
  return makeBlockie(address)
}
