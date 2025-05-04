//

import { ColorGuide } from '@/components/StyleGuide/ColorGuide'
import { VoicesGuide } from '@/components/StyleGuide/VoicesGuide'
export default function StyleGuidePage() {
  return (
    <main className="">
      <section>
        <div className="inner-column">
          <div>
            <h1 className="booming-voice mb-6">Style Guide</h1>
            <p className="text-muted-foreground">
              A comprehensive guide to the design system and components.
            </p>
          </div>
          {/* <div className="fixed right-4 top-4 w-[300px]">
          <ThemeToggle />
        </div> */}
        </div>
      </section>
      <section>
        <div className="inner-column wide">
          <ColorGuide />
        </div>
      </section>

      <section>
        <div className="inner-column wide">
          <VoicesGuide />
        </div>
      </section>
    </main>
  )
}
