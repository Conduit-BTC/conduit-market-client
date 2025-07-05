import React, { useEffect, useState } from 'react'
import { useAccountStore } from '@/stores/useAccountStore'
import { NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { useNdk } from 'nostr-hooks'
import { NDKService } from '@/services/ndkService.ts'
import { DEFAULT_RELAYS } from '@/lib/constants/defaultRelays.ts'
import useWindowState, {
  type WindowComponentRegistry,
  WindowTypes
} from './stores/useWindowState.ts'
import LoginWindow from './layouts/windows/LoginWindow.tsx'
import NDKHeadless from './components/ndk.ts'
import { useRelayState } from './stores/useRelayState.ts'
import { useInterfaceStore } from '@/stores/useInterfaceStore'

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isNdkReady, setNdkReady] = useState(false)
  const { activeRelayPool } = useRelayState()
  const { setAppLoading } = useInterfaceStore()
  const { isLoggedIn, fetchUser, user } = useAccountStore()

  /**
   * NDK initialization
   */
  const { initNdk, ndk } = useNdk()

  // Start loading only when we need to initialize
  useEffect(() => {
    if (!ndk) {
      const relayUrls =
        activeRelayPool.length > 0 ? activeRelayPool : DEFAULT_RELAYS

      setAppLoading(true, 'Connecting to relays...')
      initNdk({
        explicitRelayUrls: relayUrls,
        signer: new NDKNip07Signer()
      })
    }
  }, [initNdk, activeRelayPool, setAppLoading, ndk])

  useEffect(() => {
    if (!ndk) return

    try {
      // This will throw if NDK service is not initialized
      NDKService.getInstance()
    } catch {
      // Initialize NDK service if not already initialized
      new NDKService(ndk)
    }

    // Set a timeout to ensure we don't wait too long for relay connection
    const timeoutId = setTimeout(() => {
      console.warn('Relay connection timeout - continuing without relays')
      setNdkReady(true)
      setAppLoading(false)
    }, 5000) // 5 second timeout

    ndk
      .connect()
      .then(() => {
        clearTimeout(timeoutId)
        setNdkReady(true)
        // If not logged in, we can stop loading here
        if (!isLoggedIn) {
          setAppLoading(false)
          return
        }
        // If logged in but we already have user data, stop loading
        if (user) {
          setAppLoading(false)
          return
        }
        // Only continue loading if we need to fetch user data
        setAppLoading(true, 'Loading user data...')
      })
      .catch((err) => {
        clearTimeout(timeoutId)
        console.error('Error connecting NDK:', err)
        // Continue even if relay connection fails
        setNdkReady(true)
        setAppLoading(false)
      })

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId)
  }, [ndk, setAppLoading, isLoggedIn, user])

  /**
   * Window state initialization and management
   */
  const { registerComponents } = useWindowState()

  useEffect(() => {
    const components: WindowComponentRegistry = {
      [WindowTypes.LOGIN]: LoginWindow
    }
    registerComponents(components)
  }, [registerComponents])

  /**
   * Account initialization - only after NDK is ready
   */
  useEffect(() => {
    // If NDK isn't ready yet, wait
    if (!isNdkReady) return

    // If not logged in, ensure loading is stopped
    if (!isLoggedIn) {
      setAppLoading(false)
      return
    }

    // If we already have user data, ensure loading is stopped
    if (user) {
      setAppLoading(false)
      return
    }

    // Only fetch user data if we're logged in and don't have it yet
    const initialize = async () => {
      try {
        await fetchUser()
      } catch (error) {
        console.error('Error fetching user during initialization:', error)
      } finally {
        setAppLoading(false)
      }
    }

    initialize()
  }, [isNdkReady, isLoggedIn, fetchUser, user, setAppLoading])

  return (
    <>
      <NDKHeadless />
      {children}
    </>
  )
}

export default AppInitializer
