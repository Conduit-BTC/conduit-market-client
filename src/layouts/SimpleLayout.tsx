import Icon from '@/components/Icon'
import Logo from '@/components/Logo'
import Button from '@/components/Buttons/Button'
import SlideDrawer from '@/components/SlideDrawer'
import React, { type PropsWithChildren } from 'react'
import PageSection from '@/layouts/PageSection'
import Breadcrumbs from '@/components/Breadcumbs'

const legalLinks = [
  {
    name: 'Privacy Policy',
    link: '/privacy'
  },
  {
    name: 'Terms of Service',
    link: '/terms'
  },
  {
    name: 'Cookies Settings',
    link: '/cookies'
  }
]

const SimpleLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header className="relative">
        <PageSection width="wide">
          <div className="flex justify-between items-center gap-4">
            <div>
              <Logo className="max-w-50" />
              <Breadcrumbs />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center flex-1 justify-end gap-4">
              <Button variant="ghost" isLink to="/shop">
                <Icon icon="shoppingCart" />
                <span className="">Shop</span>
              </Button>

              <Button variant="ghost" isLink to="/orders">
                <Icon icon="wand" />
                <span className="">How it works</span>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <SlideDrawer>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant="ghost"
                  isLink
                  to="/shop"
                  className="w-full justify-start"
                >
                  <Icon icon="shoppingCart" className="max-w-5 mr-2" />
                  <span>Shop</span>
                </Button>

                <Button
                  variant="ghost"
                  isLink
                  to="/orders"
                  className="w-full justify-start"
                >
                  <Icon icon="wand" className="max-w-5 mr-2" />
                  <span>How it works</span>
                </Button>
              </div>
            </SlideDrawer>
          </div>
        </PageSection>
      </header>

      <main>{children}</main>

      <footer>
        <PageSection width="narrow">
          <div className="border-t border-muted py-8 flex flex-col md:flex-row justify-between items-center">
            <div className="legal flex items-center flex-wrap gap-4">
              <span className="voice-sm text-muted-foreground">
                © 2025 Conduit. All rights reserved.
              </span>
              {legalLinks.map((link) => (
                <React.Fragment key={link.name}>
                  <span className="text-base-400">|</span>
                  <Button
                    variant="link"
                    size="sm"
                    isLink
                    to={link.link}
                    rounded={false}
                  >
                    {link.name}
                  </Button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </PageSection>
      </footer>
    </>
  )
}

export default SimpleLayout
