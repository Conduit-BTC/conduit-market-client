import React, { useEffect, useRef, useState } from 'react'
import { useAccountStore } from '@/stores/useAccountStore'
import Button from './Buttons/Button'
import {
  MessagesSquare,
  Menu,
  SearchIcon,
  ShoppingCart,
  User,
  Wand,
  X
} from 'lucide-react'
import Field from './Form/Field'

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn } = useAccountStore()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
        aria-label="Menu"
      >
        <Menu />
      </Button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-base-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X />
            </Button>
          </div>

          <div className="space-y-4 mt-4">
            <Field
              name="search"
              type="search"
              rightIcon={<SearchIcon />}
              className="w-full"
              placeholder="Search..."
            />

            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                isLink
                to="/shop"
                className="w-full justify-start"
              >
                <ShoppingCart className="max-w-5 mr-2" />
                <span>Shop</span>
              </Button>

              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  isLink
                  to="/orders"
                  className="w-full justify-start"
                >
                  <Wand className="max-w-5 mr-2" />
                  <span>Orders</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  isLink
                  to="/how-it-works"
                  className="w-full justify-start"
                >
                  <Wand className="max-w-5 mr-2" />
                  <span>How it works</span>
                </Button>
              )}

              {isLoggedIn && (
                <Button
                  variant="ghost"
                  isLink
                  to="/messages"
                  className="w-full justify-start"
                >
                  <MessagesSquare className="max-w-5 mr-2" />
                  <span>Messages</span>
                </Button>
              )}

              <Button
                variant="ghost"
                isLink
                to="/sell"
                className="w-full justify-start"
              >
                <Wand className="max-w-5 mr-2" />
                <span>Sell</span>
              </Button>

              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  isLink
                  to="/user"
                  className="w-full justify-start"
                >
                  <User className="max-w-5 mr-2" />
                  <span>Profile</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  isLink
                  to="/login"
                  className="w-full justify-start"
                >
                  <User className="max-w-5 mr-2" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
