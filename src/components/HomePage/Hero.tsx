import PageSection from '@/layouts/PageSection'
import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/Cards/CardComponents'

// Styles object to organize all component classes
const styles = {
  // Base card styles with hover effects and positioning
  baseCard:
    'h-full border-none transition-all duration-300 hover:scale-102 relative overflow-hidden group',

  // Main grid container layout and responsive settings
  gridContainer:
    'grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 gap-4 min-h-[100vh] lg:min-h-[70vh] 3xl:min-h-[60vh]',

  // Image container styles with hover animations
  imageContainer:
    'absolute inset-0 transition-transform duration-300 scale-101 group-hover:scale-110',
  image: 'w-full h-full object-cover',

  // Card header styles with responsive layout and hover effects
  cardHeader: {
    base: 'h-full flex gap-8 justify-between flex-wrap lg:flex-nowrap p-6 relative z-10',
    background:
      'bg-gradient-to-t from-paper/50 to-transparent lg:bg-none lg:h-auto',
    animation: 'group-hover:scale-105 transition-all duration-300'
  },

  // Typography styles
  title: 'text-sm lg:max-w-1/2 flex-1'
}

const heroCards = [
  {
    id: 1,
    title: 'Decentralized marketplace freedom',
    description:
      'The open social e-commerce platform powered by NOSTR, ensuring privacy and control over your transactions.',
    isMainCard: true,
    gridClass: 'col-span-2 row-span-2',
    imageSrc: '/images/hero1.jpg'
  },
  {
    id: 2,
    title: 'Instant payments with lightning BTC',
    description: null,
    gridClass: '',
    imageSrc: '/images/hero2.jpg'
  },
  {
    id: 3,
    title: 'Discover curated legal products from visionary brands and artisans',
    description: null,
    gridClass: 'row-span-3',
    imageSrc: '/images/hero3.jpg'
  },
  {
    id: 4,
    title: 'Build trust through a network of verified, meaningful interactions',
    description: null,
    gridClass: 'row-span-2',
    imageSrc: '/images/hero4.jpg'
  },
  {
    id: 5,
    title: 'Customize algorithms or create your own',
    description: null,
    gridClass: '',
    imageSrc: '/images/hero5.jpg'
  },
  {
    id: 6,
    title: 'Your data, your rules. No tracking, no manipulation.',
    description: null,
    gridClass: '',
    imageSrc: '/images/hero6.jpg'
  }
]

const Hero: React.FC = () => {
  return (
    <PageSection width="wide">
      <ul className={styles.gridContainer}>
        {heroCards.map((card) => (
          <li key={card.id} className={card.gridClass}>
            <Card className={styles.baseCard}>
              <picture className={styles.imageContainer}>
                <img
                  src={card.imageSrc}
                  alt={card.title}
                  className={styles.image}
                />
              </picture>
              <CardHeader
                className={`${styles.cardHeader.base} ${styles.cardHeader.background} ${styles.cardHeader.animation}`}
              >
                {card.isMainCard ? (
                  <>
                    <h1 className="voice-6l">{card.title}</h1>
                    <CardDescription>{card.description}</CardDescription>
                  </>
                ) : (
                  <CardTitle className={styles.title}>{card.title}</CardTitle>
                )}
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </PageSection>
  )
}

export default Hero
