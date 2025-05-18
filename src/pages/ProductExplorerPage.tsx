import CategoryHeader from '@/components/CategoryHeader/CategoryHeader'
import { CartDrawer } from '@/layouts/CartDrawer.tsx'
import PageSection from '@/layouts/PageSection'
import ProductGrid from '@/layouts/ProductGrid.tsx'

const content = {
  title: 'Product Explorer',
  description:
    'This is a product explorer page. It is used to explore all products in the database. This is a test description. More text to test the truncation. Here you will find a list of products that are available in the database. Loading more text to test the truncation. Here you will find a list of products that are available in the database. Loading more text to test the truncation. Here you will find a list of products that are available in the database.'
}

export const ProductExplorerPage = () => {
  return (
    <>
      <PageSection width="wide">
        <CategoryHeader
          title={content.title}
          description={content.description}
        />
      </PageSection>

      <ProductGrid />
    </>
  )
}
