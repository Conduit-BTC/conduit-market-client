import { Route, Switch, Redirect } from 'wouter'
import HomePage from '@/pages/HomePage'
import StyleGuidePage from '@/pages/StyleGuide'
import MerchantsPage from '@/pages/MerchantsPage'
import MerchantProductsPage from '@/pages/MerchantProductsPage'
import { ProductExplorerPage } from '@/pages/ProductExplorerPage'
import CategoriesPage from '@/pages/CategoriesPage'
import CategoryProductsPage from '@/pages/CategoryProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartsPage from '@/pages/CartsPage'
import CartDetailPage from '@/pages/CartDetailPage'
import ProfilePage from '@/pages/ProfilePage'
import UserPage from '@/pages/UserPage'
import OrdersPage from '@/pages/OrdersPage'
import HowItWorksPage from '@/pages/HowItWorksPage'
import ZapoutPage from '@/pages/ZapoutPage'
import AuthPage from '@/pages/AuthPage'
import MainLayout from '@/layouts/MainLayout'
import SimpleLayout from '@/layouts/SimpleLayout'
import HUDLayer from '@/layouts/HUDLayer.tsx'
import CreateAccountPage from './CreateAccountPage'
import NotFoundPage from './NotFoundPage'

interface RouteConfig {
  label: string
  path: string
  pageComponent: React.ComponentType<any>
  layout?: React.ComponentType<{ children: React.ReactNode }> | null
  hasHUD?: boolean
}

const routes: RouteConfig[] = [
  {
    label: 'Home',
    path: '/',
    pageComponent: HomePage,
    hasHUD: true
  },
  {
    label: 'Authentication',
    path: '/auth',
    pageComponent: AuthPage,
    layout: SimpleLayout
  },
  {
    label: 'Create Nsec',
    path: '/auth/create',
    pageComponent: CreateAccountPage,
    layout: SimpleLayout
  },
  {
    label: 'Product Details',
    path: '/product/:productId',
    pageComponent: ProductDetailPage
  },
  {
    label: 'How It Works',
    path: '/how-it-works',
    pageComponent: HowItWorksPage
  },
  {
    label: 'Zapout',
    path: '/zapout/:merchantPubkey',
    pageComponent: ZapoutPage,
    layout: SimpleLayout
  },

  {
    label: 'Style Guide',
    path: '/style-guide',
    pageComponent: StyleGuidePage
  },
  {
    label: 'Style Guide Tab',
    path: '/style-guide/:tab',
    pageComponent: StyleGuidePage
  },
  {
    label: 'Component Guide',
    path: '/style-guide/components/:componentTab',
    pageComponent: StyleGuidePage
  },
  {
    label: 'Merchants',
    path: '/merchants',
    pageComponent: MerchantsPage
  },
  {
    label: 'Merchant Details',
    path: '/merchants/:merchantId',
    pageComponent: MerchantProductsPage
  },
  {
    label: 'Merchant Products',
    path: '/merchants/:merchantId/products',
    pageComponent: ProductExplorerPage
  },
  {
    label: 'Categories',
    path: '/categories',
    pageComponent: CategoriesPage
  },
  {
    label: 'Category Details',
    path: '/categories/:categoryId',
    pageComponent: CategoryProductsPage
  },
  {
    label: 'Category Products',
    path: '/categories/:categoryId/products',
    pageComponent: ProductExplorerPage
  },
  {
    label: 'Shopping Carts',
    path: '/carts',
    pageComponent: CartsPage
  },
  {
    label: 'Zapout',
    path: '/zapout',
    pageComponent: CartsPage
  },
  {
    label: 'Cart Details',
    path: '/carts/:merchantId',
    pageComponent: CartDetailPage
  },
  {
    label: 'Profile',
    path: '/profile',
    pageComponent: ProfilePage
  },
  {
    label: 'User',
    path: '/user',
    pageComponent: UserPage
  },
  {
    label: 'Orders',
    path: '/orders',
    pageComponent: OrdersPage
  },
  {
    label: 'My Orders',
    path: '/profile/orders',
    pageComponent: OrdersPage
  }
]

// Simple component to render flat routes
const renderRoutes = (
  routeConfigs: RouteConfig[],
  parentHasHUD = false
): React.ReactElement[] => {
  return routeConfigs.map((route, index) => {
    const Page = route.pageComponent
    const Layout = route.layout !== null ? route.layout || MainLayout : null
    const shouldShowHUD = route.hasHUD || parentHasHUD

    return (
      <Route key={`${route.path}-${index}`} path={route.path}>
        {Layout ? (
          <Layout>
            <Page />
          </Layout>
        ) : (
          <Page />
        )}
        {shouldShowHUD && <HUDLayer />}
      </Route>
    )
  })
}

export const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/shop">
        <Redirect to="/" />
      </Route>
      {renderRoutes(routes)}
      {/* 404 catch-all route */}
      <Route path="/:rest*">
        <MainLayout>
          <NotFoundPage />
        </MainLayout>
      </Route>
    </Switch>
  )
}
