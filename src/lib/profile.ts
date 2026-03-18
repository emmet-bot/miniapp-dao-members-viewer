import { IPFS_GATEWAY } from './constants'

export interface ProfileData {
  name: string
  description: string
  tags: string[]
  profileImage: string | null
  backgroundImage: string | null
}

function resolveUrl(url: string): string {
  if (url.startsWith('ipfs://')) {
    return IPFS_GATEWAY + url.slice(7)
  }
  return url
}

function getBestImage(
  images: any[] | undefined
): string | null {
  if (!images || images.length === 0) return null
  // images is an array of image entries, each can have multiple sizes
  const first = images[0]
  if (!first) return null
  // Could be { url: string } or array of sizes [{url, width, height}]
  if (Array.isArray(first)) {
    // Array of sizes - pick the smallest reasonable one
    const sorted = [...first].sort(
      (a: any, b: any) => (a.width || 9999) - (b.width || 9999)
    )
    const img = sorted.find((s: any) => (s.width || 0) >= 200) || sorted[0]
    return img?.url ? resolveUrl(img.url) : null
  }
  if (first.url) return resolveUrl(first.url)
  return null
}

export function decodeJsonUrl(hex: string): { url: string } | null {
  try {
    // JSONURL format: hashFunction(4) + hash(32) + url
    // The first byte pair after 0x tells us the encoding
    const data = hex.startsWith('0x') ? hex.slice(2) : hex

    // Check for VerifiableURI format: 0x0000 prefix for JSONURL
    // hashFunction (bytes4) + json hash (bytes32) + url (remaining)
    const hashFunctionBytes = data.slice(0, 8)
    const hashBytes = data.slice(8, 72)

    // The rest is the URL encoded as UTF-8
    const urlHex = data.slice(72)
    if (urlHex.length === 0) return null

    const url = hexToUtf8(urlHex)
    return { url: resolveUrl(url) }
  } catch {
    return null
  }
}

function hexToUtf8(hex: string): string {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return new TextDecoder().decode(bytes)
}

export async function fetchProfileData(
  lsp3Hex: string
): Promise<ProfileData | null> {
  try {
    const decoded = decodeJsonUrl(lsp3Hex)
    if (!decoded) return null

    const response = await fetch(decoded.url)
    if (!response.ok) return null

    const json = await response.json()
    const profile = json.LSP3Profile || json

    return {
      name: profile.name || '',
      description: profile.description || '',
      tags: profile.tags || [],
      profileImage: getBestImage(profile.profileImage),
      backgroundImage: getBestImage(profile.backgroundImage),
    }
  } catch {
    return null
  }
}
