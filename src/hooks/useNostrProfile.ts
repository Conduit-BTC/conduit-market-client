import { useEffect, useState } from 'react'
import { nip19 } from 'nostr-tools'
import { NDKUser, NDKEvent } from '@nostr-dev-kit/ndk'
import { getNdk } from '@/services/ndkService'

export interface NostrProfile {
  pubkey: string
  npub: string
  name?: string
  displayName?: string
  picture?: string
  loading: boolean
  error?: string
}

export function useNostrProfile(pubkey?: string): NostrProfile {
  const [profile, setProfile] = useState<NostrProfile>({
    pubkey: pubkey || '',
    npub: pubkey ? nip19.npubEncode(pubkey) : '',
    loading: !!pubkey
  })

  useEffect(() => {
    if (!pubkey) return
    let cancelled = false
    async function fetchProfile() {
      setProfile((p) => ({ ...p, loading: true }))
      try {
        const ndk = await getNdk()
        const user = new NDKUser({ pubkey })
        await user.fetchProfile()
        if (!cancelled) {
          setProfile((p) => ({
            ...p,
            name: user.profile?.name,
            displayName: user.profile?.displayName,
            picture: user.profile?.image,
            loading: false
          }))
        }
      } catch (e) {
        if (!cancelled)
          setProfile((p) => ({ ...p, loading: false, error: String(e) }))
      }
    }
    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [pubkey])

  return profile
}
