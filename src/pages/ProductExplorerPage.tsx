import Banner from '@/components/Banner'
import Breadcrumbs from '@/components/Breadcumbs'
import ContactHelp from '@/components/Buttons/ContactHelp'
import CategoryHeader from '@/components/CategoryHeader'
import NewsletterSignup from '@/components/NewsletterSignup'
import { IconPill } from '@/components/Pill'
import PageSection from '@/layouts/PageSection'


const content = {
  title: 'Product Explorer',
  description:
    'This is a product explorer page. It is used to explore all products in the database. This is a test description. More text to test the truncation. Here you will find a list of products that are available in the database. Loading more text to test the truncation. Here you will find a list of products that are available in the database. Loading more text to test the truncation. Here you will find a list of products that are available in the database.',
  breadcrumbs: [
    { label: 'Home', path: '/' },
    { label: 'Product Explorer', path: '/product-explorer' },
    {
      label: 'All Products',
      path: '/product-explorer/all-products',
      isActive: true
    }
  ]
}

export const ProductExplorerPage: React.FC = () => {
  const shopName = 'Conduit Market'

  return (
    <>
      <PageSection width="wide">
        <Breadcrumbs items={content.breadcrumbs} />
        <CategoryHeader
          title={content.title}
          description={content.description}
        />
      </PageSection>

   

      <Banner />

      <PageSection width="wide">
        <h2 className="voice-2l">Popular Searches in {shopName}</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 20 }, (_, index) => (
            <IconPill key={index} leftIcon="Search" text={`Product ${index + 1}`} />
          ))}
        </div>
      </PageSection>

      <PageSection width="wide">
        <div className="flex gap-30">
          <NewsletterSignup />
          <ContactHelp />
        </div>
      </PageSection>
    </>
  )
}
