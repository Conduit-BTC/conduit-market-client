import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useRelayState } from '@/stores/useRelayState'
import { DEFAULT_RELAYS } from '@/lib/constants/defaultRelays'
import { cn } from '@/lib/utils'
import Button from '@/components/Buttons/Button'
import Icon from '@/components/Icon'

interface RelayPoolSelectorProps {
  className?: string
  label?: string
  placeholder?: string
}

export const RelayPoolSelector: React.FC<RelayPoolSelectorProps> = ({
  className = '',
  label = 'Select Relays',
  placeholder = 'Choose relays...'
}) => {
  const { activeRelayPool, setActiveRelayPool } = useRelayState()
  const [isOpen, setIsOpen] = useState(false)
  const [customRelay, setCustomRelay] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined
  )

  // Get all available relays (default + any custom ones that have been added)
  const allRelays = Array.from(new Set([...DEFAULT_RELAYS, ...activeRelayPool]))

  // Position dropdown below button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        zIndex: 9999
      })
      setDropdownWidth(rect.width)
    }
  }, [isOpen])

  // Close dropdown on outside click, but not if click is inside button or menu
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        (buttonRef.current && buttonRef.current.contains(target)) ||
        (menuRef.current && menuRef.current.contains(target))
      ) {
        return
      }
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  const handleRelayToggle = (relay: string) => {
    const isSelected = activeRelayPool.includes(relay)
    if (isSelected) {
      setActiveRelayPool(activeRelayPool.filter((r) => r !== relay))
    } else {
      setActiveRelayPool([...activeRelayPool, relay])
    }
  }

  const handleAddCustomRelay = () => {
    if (customRelay.trim() && !allRelays.includes(customRelay.trim())) {
      setActiveRelayPool([...activeRelayPool, customRelay.trim()])
      setCustomRelay('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomRelay()
    }
  }

  const selectedCount = activeRelayPool.length
  const displayText =
    selectedCount === 0
      ? placeholder
      : selectedCount === 1
      ? activeRelayPool[0]
      : `${selectedCount} relays selected`

  // Dropdown menu JSX
  const dropdownMenu = (
    <div
      ref={menuRef}
      style={{ ...dropdownStyle, width: dropdownWidth }}
      className={cn(
        'bg-base-900 border border-base-700 rounded-lg shadow-lg',
        'max-h-60 overflow-y-auto overflow-x-hidden',
        'mt-1'
      )}
    >
      {/* Custom Relay Input */}
      <div className="p-3 border-b border-base-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={customRelay}
            onChange={(e) => setCustomRelay(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add custom relay..."
            className={cn(
              'flex-1 px-3 py-2 text-sm',
              'bg-base-800 border border-base-600 rounded-lg',
              'text-foreground placeholder:text-base-400',
              'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500'
            )}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddCustomRelay}
            disabled={!customRelay.trim()}
            className="px-3 flex-shrink-0"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Relay Options */}
      <div className="py-1">
        {allRelays.map((relay) => (
          <label
            key={relay}
            className={cn(
              'flex items-center px-3 py-2 text-sm cursor-pointer',
              'hover:bg-base-800 transition-colors'
            )}
          >
            <input
              type="checkbox"
              checked={activeRelayPool.includes(relay)}
              onChange={() => handleRelayToggle(relay)}
              className={cn(
                'h-4 w-4 rounded border-base-600 flex-shrink-0',
                'text-primary-500 focus:ring-primary-500',
                'bg-base-800 focus:ring-2'
              )}
            />
            <span className="ml-3 text-foreground break-all">{relay}</span>
          </label>
        ))}
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-base-700">
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setActiveRelayPool([])}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveRelayPool([...DEFAULT_RELAYS])}
            className="flex-1"
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="voice-sm font-bold text-foreground mb-2 block">
          {label}
        </label>
      )}
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex items-center w-full p-2 pl-4 rounded-lg border bg-base-900',
          'voice-base shadow-sm transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-ring',
          'border-base-700 hover:border-base-600',
          'text-left text-foreground'
        )}
      >
        <span className="block truncate flex-1">{displayText}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <Icon.ChevronDown
            className={cn(
              'h-4 w-4 text-base-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </span>
      </button>
      {isOpen && ReactDOM.createPortal(dropdownMenu, document.body)}
    </div>
  )
}
