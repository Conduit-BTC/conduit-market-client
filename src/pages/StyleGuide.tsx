//

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'
import { ColorGuide } from '@/components/StyleGuide/ColorGuide'
import { TypographyGuide } from '@/components/StyleGuide/TypographyGuide'
import { ButtonGuide } from '@/components/StyleGuide/ButtonGuide'
import { ComponentsGuide } from '@/components/StyleGuide/ComponentsGuide'
import PageSection from '@/layouts/PageSection'
import { useParams, useLocation } from 'wouter'
import Breadcrumbs from '@/components/Breadcumbs'
import { CardsGuide } from '@/components/StyleGuide/CardsGuide'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function StyleGuidePage() {
  const [location, setLocation] = useLocation()
  const params = useParams<{ tab?: string; componentTab?: string }>()
  const [animate] = useAutoAnimate()
  const currentTab = params.tab || 'design-system'
  const currentComponentTab = params.componentTab || 'all'

  const handleTabChange = (value: string) => {
    if (value === 'design-system') {
      setLocation('/style-guide')
    } else {
      setLocation(`/style-guide/${value}`)
    }
  }

  const handleComponentTabChange = (value: string) => {
    setLocation(`/style-guide/components/${value}`)
  }

  // If we're on a component tab route, force the main tab to be 'components'
  const effectiveTab = params.componentTab ? 'components' : currentTab

  return (
    <main className="grid gap-8">
      <PageSection width="wide">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="voice-6l mb-6">Style Guide</h1>
          <p className="text-muted-foreground">
            A comprehensive guide to the design system and components.
          </p>
        </div>
      </PageSection>

      <Tabs
        value={effectiveTab}
        onValueChange={handleTabChange}
        className="w-full"
        ref={animate}
      >
        <PageSection width="wide">
          <TabsList className="w-full justify-start sticky top-0 bg-background z-10">
            <TabsTrigger value="design-system">Design System</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="voices">Typography & Voices</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>
        </PageSection>

        <TabsContent value="design-system" className="mt-6 grid gap-20">
          <PageSection width="wide">
            <ColorGuide />
            <TypographyGuide />
          </PageSection>
        </TabsContent>

        <TabsContent value="colors" className="mt-6">
          <PageSection width="wide">
            <ColorGuide />
          </PageSection>
        </TabsContent>

        <TabsContent value="voices" className="mt-6">
          <PageSection width="wide">
            <TypographyGuide />
          </PageSection>
        </TabsContent>

        <TabsContent value="buttons" className="mt-6">
          <PageSection width="wide">
            <ButtonGuide />
          </PageSection>
        </TabsContent>

        <TabsContent value="components" className="mt-6">
          <PageSection width="wide">
            <ComponentsGuide
              currentTab={currentComponentTab}
              onTabChange={handleComponentTabChange}
            />
          </PageSection>
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <PageSection width="wide">
            <CardsGuide />
          </PageSection>
        </TabsContent>
      </Tabs>
    </main>
  )
}
