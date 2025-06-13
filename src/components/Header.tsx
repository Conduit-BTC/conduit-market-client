import React, { useEffect, useRef, useState } from 'react'
import { useAccountStore } from '@/stores/useAccountStore'
import Button from './Buttons/Button'
import useWindowState, { WindowTypes } from '@/stores/useWindowState'
import Icon from './Icon'
import { useCartStore } from '@/stores/useCartStore'
import Field from './Form/Field'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import PageSection from '@/layouts/PageSection'
import Breadcrumbs from '@/components/Breadcumbs'

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [displayName, setDisplayName] = useState<string>('')
  const { user, isLoggedIn, logout } = useAccountStore()
  const { pushWindow } = useWindowState()
  const { carts, toggleHUD } = useCartStore()

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
    <header className="relative">
      <PageSection width="wide">
        <div className="flex justify-between items-center gap-4">
          <Logo className="max-w-50" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-end gap-4">
            <Button variant="ghost" isLink to="/shop">
              <Icon icon="shoppingCart" />
              <span className="">Shop</span>
            </Button>

            {/* how it works button if logged in else orders page */}
            {isLoggedIn ? (
              <Button variant="ghost" isLink to="/orders">
                <Icon icon="wand" />
                <span className="">Orders</span>
              </Button>
            ) : (
              <Button variant="ghost" isLink to="/orders">
                <Icon icon="wand" />
                <span className="">How it works</span>
              </Button>
            )}

            <Field
              name="search"
              type="search"
              rightIcon="search"
              className="w-full"
            />

            {/* messages button if logged in */}
            {isLoggedIn && (
              <Button variant="ghost" isLink to="/shop">
                <Icon icon="messages" />
                <span className="">Messages</span>
              </Button>
            )}

            {/* sell button */}
            <Button variant="ghost" isLink to="/shop">
              <Icon icon="wand" />
              <span className="">Sell</span>
            </Button>

            {/* login button, else user button */}
            {isLoggedIn ? (
              <Button variant="ghost" size="icon" isLink to="/user">
                <Icon icon="user" />
              </Button>
            ) : (
              <Button variant="primary" isLink to="/auth">
                <Icon icon="user" />
                <span className="">Login</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
        <Breadcrumbs />
      </PageSection>
    </header>
  )
}

export default Header
