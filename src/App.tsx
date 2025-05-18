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
import { CartDrawer } from './layouts/CartDrawer.tsx'

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
          <Route path="/" component={ProductExplorerPage} />
          <Route path="/zapout" component={ZapoutPage} />
          <Route path="/checkout" component={ZapoutPage} />
          <Route path="/orders" component={OrdersPage} />
          <Route path="/style-guide" component={StyleGuidePage} />
        </Switch>
        <CartDrawer />
      </main>
      <Footer />
    </AppInitializer>
  )
}

export default App
