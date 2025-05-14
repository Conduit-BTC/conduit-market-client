import React from 'react'
import Button from './Buttons/Button'
import { Heart } from 'lucide-react'

interface NavLink {
  name: string
  link: string
}

interface NavSection {
  heading: string
  links: NavLink[]
}

const navs: NavSection[] = [
  {
    heading: 'Shop',
    links: [
      {
        name: 'All',
        link: '/shop/all'
      },
      {
        name: 'Categories',
        link: '/shop/categories'
      },
      {
        name: 'Search',
        link: '/shop/search'
      },
      {
        name: 'Trending',
        link: '/shop/trending'
      }
    ]
  },
  {
    heading: 'Sell',
    links: [
      {
        name: 'Your stores',
        link: '/sell/stores'
      },
      {
        name: 'Your products',
        link: '/sell/products'
      },
      {
        name: 'Manage store',
        link: '/sell/manage'
      },
      {
        name: 'Messages',
        link: '/sell/messages'
      }
    ]
  },
  {
    heading: 'For Sellers',
    links: [
      {
        name: 'Book a demo',
        link: '/sellers/demo'
      },
      {
        name: 'Create a store',
        link: '/sellers/create'
      },
      {
        name: 'Features',
        link: '/sellers/features'
      },
      {
        name: 'Why Conduit',
        link: '/sellers/why-conduit'
      },
      {
        name: 'FAQ',
        link: '/sellers/faq'
      }
    ]
  },
  {
    heading: 'For Shoppers',
    links: [
      {
        name: 'Join waitlist',
        link: '/shoppers/waitlist'
      },
      {
        name: 'Features',
        link: '/shoppers/features'
      },
      {
        name: 'Why Conduit',
        link: '/shoppers/why-conduit'
      },
      {
        name: 'About us',
        link: '/shoppers/about'
      },
      {
        name: 'FAQ',
        link: '/shoppers/faq'
      }
    ]
  },
  {
    heading: 'You',
    links: [
      {
        name: 'Your profile',
        link: '/profile'
      },
      {
        name: 'Settings',
        link: '/settings'
      },
      {
        name: 'Link Twenty Three',
        link: '/link-23'
      },
      {
        name: 'Link Twenty Four',
        link: '/link-24'
      },
      {
        name: 'Link Twenty Five',
        link: '/link-25'
      }
    ]
  }
]

const socials = [
  {
    name: 'GitHub',
    link: '#',
    icon: 'github'
  },
  {
    name: 'Facebook',
    link: '#',
    icon: 'facebook'
  },
  {
    name: 'Instagram',
    link: '#',
    icon: 'instagram'
  },
  {
    name: 'X',
    link: '#',
    icon: 'x'
  },
  {
    name: 'LinkedIn',
    link: '#',
    icon: 'linkedin'
  }
]

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

const Footer = () => {
  return (
    <footer className="bg-paper overflow-hidden">
      <section className="links">
        <div className="inner-column wide pt-12 grid gap-8 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          <picture className="max-w-50">
            <img
              src={
                new URL('@/assets/images/logo/logo-full.svg', import.meta.url)
                  .href
              }
              alt="Conduit Market"
            />
          </picture>
          {navs.map((nav) => (
            <nav key={nav.heading}>
              <h3 className="calm-voice font-bold">{nav.heading}</h3>
              <ul className="mt-4 grid gap-1 justify-start">
                {nav.links.map((link) => (
                  <li key={link.name}>
                    <Button
                      variant="link"
                      size="sm"
                      isLink
                      to={link.link}
                      rounded={false}
                      className="justify-start pl-0"
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>

      <section className="legal-social">
        <div className="inner-column wide border-t border-base py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="legal flex items-center flex-wrap gap-4">
            <span className="whisper-voice">
              © 2024 Conduit. All rights reserved.
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

          <div className="social flex gap-2">
            {socials.map((social) => (
              <Button
                key={social.name}
                variant="link"
                size="icon"
                isLink
                to={social.link}
                rounded={false}
              >
                <Heart />
              </Button>
            ))}
          </div>
        </div>
      </section>
    </footer>
  )
}

export default Footer
