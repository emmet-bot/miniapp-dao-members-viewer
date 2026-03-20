import { IPFS_GATEWAY } from './constants'
import { fetchLSP3Profile } from './blockchain'

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

function getBestImage(images: any[] | undefined): string | null {
  if (!images || images.length === 0) return null
  const first = images[0]
  if (!first) return null
  if (Array.isArray(first)) {
    const sorted = [...first].sort(
      (a: any, b: any) => (a.width || 9999) - (b.width || 9999)
    )
    const img = sorted.find((s: any) => (s.width || 0) >= 200) || sorted[0]
    return img?.url ? resolveUrl(img.url) : null
  }
  if (first.url) return resolveUrl(first.url)
  return null
}

export async function fetchProfileData(
  address: string,
  chainId: number
): Promise<ProfileData | null> {
  try {
    const result = await fetchLSP3Profile(address, chainId)
    if (!result) return null

    // fetchData('LSP3Profile') returns { LSP3Profile: { ... } } or the profile directly
    const profile = result.LSP3Profile || result

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
