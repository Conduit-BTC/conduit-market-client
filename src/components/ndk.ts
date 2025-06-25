import { DEFAULT_RELAYS } from '@/lib/constants/defaultRelays'
import NDK, { NDKRelay } from '@nostr-dev-kit/ndk'
import {
  NDKSessionLocalStorage,
  useNDKInit,
  useNDKSessionMonitor
} from '@nostr-dev-kit/ndk-hooks'
import { useEffect, useRef } from 'react'
import { useRelayState } from '@/stores/useRelayState'

const ndk = new NDK()

if (typeof window !== 'undefined') ndk.connect()

const sessionStorage = new NDKSessionLocalStorage()

/**
 * Use an NDKHeadless component to initialize NDK in order to prevent application-rerenders
 * when there are changes to the NDK or session state.
 *
 * Include this headless component in your app layout to initialize NDK correctly.
 * @returns
 */
export default function NDKHeadless() {
  const initNDK = useNDKInit()
  const { activeRelayPool } = useRelayState()
  const previousRelayPool = useRef<string[]>([])

  useNDKSessionMonitor(sessionStorage, {
    profile: true, // automatically fetch profile information for the active user
    follows: true // automatically fetch follows of the active user
  })

  useEffect(() => {
    if (ndk) initNDK(ndk)
  }, [initNDK])

  useEffect(() => {
    const handleRelayPoolChange = async () => {
      if (!ndk) return

      const currentRelays = Array.from(ndk.pool.relays.values())
      for (const relay of currentRelays) {
        await relay.disconnect()
      }

      ndk.pool.relays.clear()

      if (activeRelayPool.length > 0) {
        activeRelayPool.forEach((relayUrl) => {
          const relay = new NDKRelay(relayUrl, undefined, ndk)
          ndk.pool.addRelay(relay)
        })
        await ndk.connect()
        console.log('NDK reconnected with relays:', activeRelayPool)
      } else {
        // No relays: do not connect
        console.log('NDK relay pool is empty. No relays connected.')
      }
    }

    const relayPoolChanged =
      JSON.stringify(previousRelayPool.current) !==
      JSON.stringify(activeRelayPool)

    if (relayPoolChanged) {
      previousRelayPool.current = [...activeRelayPool]
      handleRelayPoolChange()
    }
  }, [activeRelayPool])

  return null
}
