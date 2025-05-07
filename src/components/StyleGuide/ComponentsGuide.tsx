import ProductCard from '@/components/Cards/ProductCard'

const cards = [
  {
    name: 'Product Card',
    component: ProductCard
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

export function ComponentsGuide() {
  return (
    <div className="space-y-8">
      <h2 className="attention-voice mb-6">Components</h2>

      {/* Cards */}
      <div>
        <h3 className="firm-voice">Cards</h3>
        <div className="flex flex-wrap gap-4">
          {cards.map(
            (card) =>
              card.component && (
                <div key={card.name}>
                  <h4 className="firm-voice">{card.name}</h4>
                  <card.component demo={true} />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  )
}
