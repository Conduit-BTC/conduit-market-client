import { create } from 'zustand'
import { DEFAULT_RELAYS } from '@/lib/constants/defaultRelays'

const STORAGE_KEY = 'conduit.activeRelayPool'

function getInitialRelayPool(): string[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) return parsed
      } catch {}
    }
  }
  return [...DEFAULT_RELAYS]
}

interface RelayState {
  activeRelayPool: string[]
  relayPoolVersion: number
  setActiveRelayPool: (relays: string[]) => void
  addRelayToPool: (relay: string) => void
  removeRelayFromPool: (relay: string) => void
  clearRelayPool: () => void
  resetToDefaultRelays: () => void
}

export const useRelayState = create<RelayState>((set, get) => {
  // Hydrate from localStorage
  const initialPool = getInitialRelayPool()

  // Save to localStorage on change
  const save = (relays: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(relays))
    }
  }

  return {
    activeRelayPool: initialPool,
    relayPoolVersion: 0,

    setActiveRelayPool: (relays: string[]) => {
      save(relays)
      set((state) => ({
        activeRelayPool: relays,
        relayPoolVersion: state.relayPoolVersion + 1
      }))
    },

    addRelayToPool: (relay: string) => {
      const current = get().activeRelayPool
      if (!current.includes(relay)) {
        const updated = [...current, relay]
        save(updated)
        set((state) => ({
          activeRelayPool: updated,
          relayPoolVersion: state.relayPoolVersion + 1
        }))
      }
    },

    removeRelayFromPool: (relay: string) => {
      const updated = get().activeRelayPool.filter((r) => r !== relay)
      save(updated)
      set((state) => ({
        activeRelayPool: updated,
        relayPoolVersion: state.relayPoolVersion + 1
      }))
    },

    clearRelayPool: () => {
      save([])
      set((state) => ({
        activeRelayPool: [],
        relayPoolVersion: state.relayPoolVersion + 1
      }))
    },

    resetToDefaultRelays: () => {
      save([...DEFAULT_RELAYS])
      set((state) => ({
        activeRelayPool: [...DEFAULT_RELAYS],
        relayPoolVersion: state.relayPoolVersion + 1
      }))
    }
  }
})
