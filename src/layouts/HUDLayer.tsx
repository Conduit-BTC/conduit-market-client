import CartDrawer from '@/layouts/CartDrawer'

/*  #todo
// - when scrolling/User interfacing the HUD fades away like a game HUD.
// - comes back when activity stops for a while.
// -  there should be a way to individually control each Hud element but also a way to control all of them at once. */

const HUDLayer: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <CartDrawer />
      </div>
    </div>
  )
}

export default HUDLayer
