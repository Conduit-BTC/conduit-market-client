import React from 'react'
import { useRelayState } from '@/stores/useRelayState'

export const RelayStatus: React.FC = () => {
  const { activeRelayPool } = useRelayState()

  return (
    <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
      <div className="font-medium">
        Active Relays ({activeRelayPool.length}):
      </div>
      {activeRelayPool.length > 0 ? (
        <ul className="mt-1 space-y-1">
          {activeRelayPool.map((relay, index) => (
            <li key={index} className="truncate">
              {relay}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400">No relays selected</div>
      )}
    </div>
  )
}
