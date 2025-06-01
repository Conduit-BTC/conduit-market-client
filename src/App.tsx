import { ProductExplorerPage } from './pages/ProductExplorerPage.tsx'
import { Route, Switch } from 'wouter'
import ZapoutPage from '@/pages/ZapoutPage.tsx'
import Header from './components/Header.tsx'
import { WindowTypes } from './stores/useWindowState.ts'
import SubWindows from './layouts/windows/SubWindows.tsx'
import AppInitializer from './AppInitializer.tsx'
import OrdersPage from './pages/OrdersPage.tsx'
import StyleGuidePage from './pages/StyleGuide.tsx'
import Footer from './components/Footer.tsx'
import HomePage from './pages/HomePage.tsx'
import HUDLayer from '@/layouts/HUDLayer.tsx'
import CategoryProductsPage from './pages/CategoryProductsPage.tsx'
import ProductDetailPage from './pages/ProductDetailPage.tsx'
import AuthPage from './pages/AuthPage.tsx'
import CartsPage from './pages/CartsPage.tsx'
import CartDetailPage from './pages/CartDetailPage.tsx'
import HowItWorksPage from './pages/HowItWorksPage.tsx'
import MerchantsPage from './pages/MerchantsPage.tsx'
import MerchantProductsPage from './pages/MerchantProductsPage.tsx'
import CategoriesPage from './pages/CategoriesPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'

const UnknownWindow: React.FC<{ windowId: WindowTypes }> = ({ windowId }) => (
  <div className="p-4 text-center">
    <div className="text-amber-500 mb-2">⚠️</div>
    <p>
      No component found for window type: <strong>{windowId}</strong>
    </p>
  </div>
)

function App() {
  return (
    <AppInitializer>
      <Header />
      <main>
        <SubWindows defaultComponent={UnknownWindow} />
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/style-guide/:page?" component={StyleGuidePage} />
          <Route path="/how-it-works" component={HowItWorksPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/merchants" component={MerchantsPage} />
          <Route
            path="/merchant/:merchantId"
            component={MerchantProductsPage}
          />
          <Route path="/categories" component={CategoriesPage} />
          <Route
            path="/category/:categoryId"
            component={CategoryProductsPage}
          />
          <Route path="/product/:productId" component={ProductDetailPage} />
          <Route path="/carts" component={CartsPage} />
          <Route path="/carts/:merchantId" component={CartDetailPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/profile/orders" component={OrdersPage} />
          <Route path="/zapout" component={ZapoutPage} />
          <Route path="/checkout" component={ZapoutPage} />
        </Switch>
        <HUDLayer />
      </main>
      <Footer />
    </AppInitializer>
  )
}

export default App
