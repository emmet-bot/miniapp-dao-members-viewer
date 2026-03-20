const ENVIO_GRAPHQL = 'https://envio.lukso-mainnet.universal.tech/v1/graphql'

export interface ProfileData {
  name: string
  description: string
  tags: string[]
  profileImage: string | null
  backgroundImage: string | null
}

/**
 * Fetch profile data from the Envio indexer (much faster than on-chain LSP3 fetch).
 * Works for any address that has a Universal Profile on LUKSO mainnet.
 */
export async function fetchProfileData(
  address: string,
  _chainId: number
): Promise<ProfileData | null> {
  try {
    const lower = address.toLowerCase()
    const query = `{
      Profile_by_pk(id: "${lower}") {
        id
        name
        profileImages { src width height }
        backgroundImages { src width height }
        tags
      }
    }`

    const res = await fetch(ENVIO_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    if (!res.ok) return null

    const json = await res.json()
    const profile = json.data?.Profile_by_pk
    if (!profile) return null

    // Pick best profile image (smallest >= 200px, or first)
    const profileImage = getBestImage(profile.profileImages)
    const backgroundImage = getBestImage(profile.backgroundImages)

    return {
      name: profile.name || '',
      description: '',
      tags: profile.tags || [],
      profileImage,
      backgroundImage,
    }
  } catch {
    return null
  }
}

/**
 * Batch fetch profiles for multiple addresses at once.
 */
export async function fetchProfilesBatch(
  addresses: string[]
): Promise<Record<string, ProfileData>> {
  if (!addresses.length) return {}
  try {
    const fragments = addresses.map((addr, i) =>
      `p${i}: Profile_by_pk(id: "${addr.toLowerCase()}") { id name profileImages { src width height } backgroundImages { src width height } tags }`
    ).join('\n')
    const query = `{ ${fragments} }`

    const res = await fetch(ENVIO_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    if (!res.ok) return {}

    const json = await res.json()
    const result: Record<string, ProfileData> = {}
    for (let i = 0; i < addresses.length; i++) {
      const profile = json.data?.[`p${i}`]
      if (profile?.name) {
        result[addresses[i].toLowerCase()] = {
          name: profile.name || '',
          description: '',
          tags: profile.tags || [],
          profileImage: getBestImage(profile.profileImages),
          backgroundImage: getBestImage(profile.backgroundImages),
        }
      }
    }
    return result
  } catch {
    return {}
  }
}

function getBestImage(images: Array<{ src: string; width: number; height: number }> | undefined): string | null {
  if (!images?.length) return null
  // Sort by width ascending, pick first >= 200px or smallest
  const sorted = [...images].sort((a, b) => a.width - b.width)
  const img = sorted.find((s) => s.width >= 200) || sorted[0]
  return img?.src || null
}
