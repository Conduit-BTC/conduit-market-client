//

import { ColorGuide } from '@/components/StyleGuide/ColorGuide'
import { VoicesGuide } from '@/components/StyleGuide/VoicesGuide'
import { ButtonGuide } from '@/components/StyleGuide/ButtonGuide'
import { ComponentsGuide } from '@/components/StyleGuide/ComponentsGuide'

export default function StyleGuidePage() {
  return (
    <main className="grid gap-16">
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

          <nav className="prose mt-12">
            <h2 className="firm-voice mb-4">Table of Contents</h2>
            <ul className="grid gap-2">
              <li>
                <a href="#colors" className="text-primary hover:underline">
                  Colors
                </a>
              </li>
              <li>
                <a href="#voices" className="text-primary hover:underline">
                  Typography & Voices
                </a>
              </li>
              <li>
                <a href="#buttons" className="text-primary hover:underline">
                  Buttons
                </a>
              </li>
              <li>
                <a href="#components" className="text-primary hover:underline">
                  Components
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <section id="colors">
        <div className="inner-column wide">
          <ColorGuide />
        </div>
      </section>

      <section id="voices">
        <div className="inner-column wide">
          <VoicesGuide />
        </div>
      </section>

      <section id="buttons">
        <div className="inner-column wide">
          <ButtonGuide />
        </div>
      </section>

      <section id="components">
        <div className="inner-column wide">
          <ComponentsGuide />
        </div>
      </section>
    </main>
  )
}
