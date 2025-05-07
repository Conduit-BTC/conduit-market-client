import ProductCard from '@/components/Cards/ProductCard'
import UserAvatar from '../UserAvatar'
import UserCounter from '../UserCounter'

const cards = [
  {
    name: 'Product Card',
    component: ProductCard,
    demoVariants: ['base', 'discount', 'soldout', 'new', 'avatars']
  },
  {
    name: 'Article Card'
    // component: ArticleCard,
  },
  {
    name: 'Store Card'
    // component: StoreCard,
  },
  {
    name: 'Collection Card'
    // component: CollectionCard,
  },
  {
    name: 'Category Card'
    // component: CategoryCard,
  },
  {
    name: 'Promotion Card'
    // component: PromotionCard,
  }
]

const avatars = [
  {
    name: 'User Avatar',
    imageUrl: 'https://avatar.iran.liara.run/public',
    component: UserAvatar
  },
  {
    name: 'User Avatar',
    imageUrl: 'https://avatar.iran.liara.run/public',
    size: 5,
    showName: false,
    component: UserAvatar
  },
  {
    name: 'User Avatar',
    size: 10,
    showName: false,
    component: UserAvatar
  },
  {
    name: 'User Counter',
    users: [
      {
        name: 'Brooj',
        imageUrl: 'https://avatar.iran.liara.run/public'
      },
      {
        name: 'Jane Doe',
        imageUrl: 'https://avatar.iran.liara.run/public'
      },
      { name: 'Burooj' }
    ],
    count: 100,
    component: UserCounter
  },
  {
    name: 'User Counter',
    users: [
      {
        name: 'Brooj',
        imageUrl: 'https://avatar.iran.liara.run/public'
      },
      {
        name: 'Jane Doe',
        imageUrl: 'https://avatar.iran.liara.run/public'
      },
      { name: 'Burooj' }
    ],
    count: 100,
    showZap: true,
    component: UserCounter
  }
]

export function ComponentsGuide() {
  return (
    <div className="space-y-8">
      <h2 className="attention-voice mb-6">Components</h2>

      {/* Avatars */}
      <div>
        <h3 className="firm-voice">Avatars</h3>
        <ul className="flex flex-wrap items-center gap-4">
          {avatars.map((avatar, index) => (
            <li key={index}>
              <avatar.component
                name={avatar.name}
                imageUrl={avatar.imageUrl}
                size={avatar.size}
                showName={avatar.showName}
                users={avatar.users}
                count={avatar.count}
                showZap={avatar.showZap}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap items-center gap-4">
        {cards.map(
          (card) =>
            card.component && (
              <div key={card.name}>
                <h4 className="notice-voice font-bold mt-4">{card.name}</h4>
                <ul className="flex flex-wrap gap-4">
                  {card.demoVariants.map((variant) => (
                    <li key={variant}>
                      <p className="calm-voice">{variant}</p>
                      <card.component demo={true} demoVariant={variant} />
                    </li>
                  ))}
                </ul>
              </div>
            )
        )}
      </div>
    </div>
  )
}
