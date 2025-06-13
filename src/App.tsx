import { useLocation } from 'wouter'
import { WindowTypes } from './stores/useWindowState.ts'
import SubWindows from './layouts/windows/SubWindows.tsx'
import AppInitializer from './AppInitializer.tsx'
import { AppRoutes } from './pages/routes.tsx'
import AuthPage from './pages/AuthPage'

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
      <SubWindows defaultComponent={UnknownWindow} />
      <AppRoutes />
    </AppInitializer>
  )
}

export default App
