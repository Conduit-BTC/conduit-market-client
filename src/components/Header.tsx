import React, { useEffect, useRef, useState } from 'react'
import { useAccountStore } from '@/stores/useAccountStore'
import Button from './Buttons/Button'
import useWindowState, { WindowTypes } from '@/stores/useWindowState'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/useCartStore'
import OrderPageButton from './Buttons/OrderPageButton'

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [displayName, setDisplayName] = useState<string>('')
  const { user, isLoggedIn, logout } = useAccountStore()
  const { pushWindow } = useWindowState()
  const { cart, openCart } = useCartStore()

  const openLoginWindow = (): void => {
    pushWindow(WindowTypes.LOGIN, {
      title: 'Lock In',
      isFullScreen: true,
      disableClickOutside: true
    })
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  const formatNpub = (npub: string): string => {
    if (!npub) return ''
    return `${npub.substring(0, 8)}...${npub.substring(npub.length - 8)}`
  }

  const handleLogout = async () => {
    logout()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchUserMetadata = async () => {
      if (user && user.npub) {
        try {
          const userProfile = await user.fetchProfile()

          if (userProfile && userProfile.displayName) {
            setDisplayName(userProfile.displayName)
          } else if (userProfile && userProfile.name) {
            setDisplayName(userProfile.name)
          } else {
            setDisplayName(formatNpub(user.npub))
          }
        } catch (error) {
          console.error('Error fetching user metadata:', error)
          setDisplayName(formatNpub(user.npub))
        }
      }
    }

    if (isLoggedIn) {
      fetchUserMetadata()
    }
  }, [user, isLoggedIn])

  return (
    <>
      <header className="shadow-md">
        <section>
          <div className="inner-column flex justify-between items-center">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Conduit Market
              </h1>
            </div>

            {/* Actions Area (Cart and Account) */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Button
                onClick={openCart}
                className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-dark transition-colors"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Button>
              {/* Orders Page Button */}
              <OrderPageButton />

              {/* Account Component */}
              {isLoggedIn && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {/* User Avatar - Default to a circle with first letter or icon */}
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                      {displayName ? displayName.charAt(0).toUpperCase() : 'N'}
                    </div>

                    <span className="hidden sm:inline text-sm font-medium">
                      {displayName || formatNpub(user.npub)}
                    </span>

                    {/* Dropdown Arrow */}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {formatNpub(user.npub)}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={openLoginWindow}>Lock In</Button>
              )}
            </div>
          </div>
        </section>
      </header>
    </>
  )
}

export default Header
