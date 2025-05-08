import React from 'react'

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
    heading: 'Navigation',
    links: [
      {
        name: 'Home',
        link: '#hero-landing'
      },
      {
        name: 'About',
        link: '#about-section'
      },
      {
        name: 'Services',
        link: '#services-section'
      },
      {
        name: 'Contact',
        link: '#contact-section'
      },
      {
        name: 'Register',
        link: '#register'
      }
    ]
  },
  {
    heading: 'Contact',
    links: [
      {
        name: 'Email Form',
        link: ''
      },
      {
        name: 'Presentation',
        link: ''
      }
    ]
  }
]

const socials = {
  links: [
    {
      name: 'X',
      link: 'https://x.com/DeSciWorld'
    },
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/company/desciworld'
    },
    {
      name: 'Discord',
      link: 'https://discord.gg/3X5YzJ9'
    },
    {
      name: 'Telegram',
      link: 'https://t.me/DeSciWorld'
    }
  ]
}

const Footer = () => {
  return (
    <footer className="bg-paper sticky bottom-0 z-[-1] overflow-hidden">
      <section className="links">
        <div className="inner-column pt-12 grid gap-8 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {navs.map((nav) => (
            <nav key={nav.heading}>
              <h3 className="teaser-voice">{nav.heading}</h3>
              <ul className="mt-2 grid gap-1 justify-start">
                {nav.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.link} className="text">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>
      <div className="w-full relative bottom-[-10px] pt-6">
        <img src="/assets/images/logo-text.svg" alt="13Black" />
      </div>
    </footer>
  )
}

export default Footer
