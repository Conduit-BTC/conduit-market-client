import React, { useEffect, useRef, useState } from 'react'
import { useAccountStore } from '@/stores/useAccountStore'
import { useOrderStore, OrderEventType } from '@/stores/useOrderStore'
import Button from './Buttons/Button'
import useWindowState, { WindowTypes } from '@/stores/useWindowState'
import Icon from './Icon'
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
  const { getUnreadCount } = useOrderStore()

  // Calculate total unread orders
  const totalUnreadOrders = isLoggedIn
    ? getUnreadCount(OrderEventType.ORDER) +
      getUnreadCount(OrderEventType.PAYMENT_REQUEST) +
      getUnreadCount(OrderEventType.STATUS_UPDATE) +
      getUnreadCount(OrderEventType.SHIPPING_UPDATE) +
      getUnreadCount(OrderEventType.PAYMENT_RECEIPT)
    : 0

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
              <Icon.ShoppingCart />
              <span className="">Shop</span>
            </Button>

            {/* how it works button if logged in else orders page */}
            {isLoggedIn ? (
              <Button variant="ghost" isLink to="/orders" className="relative">
                <Icon.ShoppingBag />
                <span className="">Orders</span>
                {totalUnreadOrders > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {totalUnreadOrders > 99 ? '99+' : totalUnreadOrders}
                  </span>
                )}
              </Button>
            ) : (
              <Button variant="ghost" isLink to="/how-it-works">
                <Icon.Wand />
                <span className="">How it works</span>
              </Button>
            )}

            <Field
              name="search"
              type="text"
              rightIcon="Search"
              className="w-full"
            />

            {/* messages button if logged in */}
            {isLoggedIn && (
              <Button variant="ghost" isLink to="/shop">
                <Icon.Messages />
                <span className="">Messages</span>
              </Button>
            )}

            {/* sell button */}
            <Button variant="ghost" isLink to="/shop">
              <Icon.Wand />
              <span className="">Sell</span>
            </Button>

            {/* login button, else user button */}
            {isLoggedIn ? (
              <Button variant="ghost" size="icon" isLink to="/user">
                <Icon.User />
              </Button>
            ) : (
              <Button variant="primary" isLink to="/auth">
                <Icon.User />
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
