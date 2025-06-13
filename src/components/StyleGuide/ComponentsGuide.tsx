import { Badge } from '../Badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../Cards/CardComponents'
import { cn } from '@/lib/utils'
import Breadcrumbs from '../Breadcumbs'
import Field from '../Form/Field'
import RankingTable, { DualRankingTable } from '../RankingTable'
import CategoryHeader from '../CategoryHeader'
import {
  Pill,
  CategoryPill,
  StorePill,
  UserPill,
  MultiUserPill,
  IconPill
} from '../Pill'
import Avatar from '../Avatar'
import NewsletterSignup from '../NewsletterSignup'
import ContactHelp from '../Buttons/ContactHelp'
import Hero from '@/components/HomePage/Hero'
import Logo from '../Logo'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'
import Carousel from '../Carousel'
import SkeletonCard from '../Cards/SkeletonCard'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface Component {
  name: string
  component: React.ComponentType<any>
  fullWidth?: boolean
  display?: boolean
  states: {
    label: string
    props: any
    children?: React.ReactNode[]
  }[]
}

const components: Component[] = [
  {
    name: 'Carousel',
    component: Carousel,
    fullWidth: true,
    states: [
      {
        label: 'Default',
        props: {
          visibleItems: 3
        },
        children: [
          <SkeletonCard key={1} />,
          <SkeletonCard key={2} />,
          <SkeletonCard key={3} />,
          <SkeletonCard key={4} />,
          <SkeletonCard key={5} />
        ]
      }
    ]
  },
  {
    name: 'Logo',
    display: true,
    component: Logo,
    states: [
      {
        label: 'Full',
        props: { variant: 'full' }
      },
      {
        label: 'Background',
        props: { variant: 'bg' }
      }
    ]
  },

  {
    name: 'Miscellaneous',
    component: ({ variant, ...props }) => {
      switch (variant) {
        case 'newsletter':
          return <NewsletterSignup {...props} />
        case 'help':
          return <ContactHelp {...props} />
        case 'breadcrumbs':
          return <Breadcrumbs {...props} />

        default:
          return null
      }
    },
    states: [
      {
        label: 'Newsletter Section',
        props: {
          variant: 'newsletter'
        }
      },
      {
        label: 'Help Section',
        props: {
          variant: 'help'
        }
      },
      {
        label: 'Breadcrumbs',
        props: {
          variant: 'breadcrumbs',
          items: [
            { label: 'Shop', path: '/' },
            { label: 'Category', path: '/category' },
            { label: 'Drinks', path: '/drinks' },
            { label: 'Coffee', path: '/coffee', isActive: true }
          ]
        }
      }
    ]
  },

  {
    name: 'Pills',
    component: ({ variant, ...props }) => {
      switch (variant) {
        case 'category':
          return <CategoryPill {...props} />
        case 'store':
          return <StorePill {...props} />
        case 'user':
          return <UserPill {...props} />
        case 'multi-user':
          return <MultiUserPill {...props} />
        case 'icon':
          return <IconPill {...props} />
        default:
          return <Pill {...props}>{props.children}</Pill>
      }
    },
    states: [
      {
        label: 'Base Pill',
        props: {
          children: 'Basic Pill Content'
        }
      },
      {
        label: 'Icon Pill',
        props: {
          variant: 'icon',
          text: 'Icon Pill',
          leftIcon: 'search'
        }
      },
      {
        label: 'Category Pill',
        props: {
          variant: 'category',
          imageUrl: 'https://avatar.iran.liara.run/public',
          label: 'Category'
        }
      },
      {
        label: 'Store Pill',
        props: {
          variant: 'store',
          imageUrl: 'https://avatar.iran.liara.run/public',
          storeName: 'Store Name'
        }
      },
      {
        label: 'User Pill',
        props: {
          variant: 'user',
          imageUrl: 'https://avatar.iran.liara.run/public',
          name: 'User Name'
        }
      },
      {
        label: 'Multi-User Pill',
        props: {
          variant: 'multi-user',
          users: [
            {
              name: 'Brooj',
              imageUrl: 'https://avatar.iran.liara.run/public'
            },
            {
              name: 'Jane Doe',
              imageUrl: 'https://avatar.iran.liara.run/public'
            },
            { name: 'Burooj' }
          ],
          count: 100
        }
      },
      {
        label: 'Multi-User Pill with Zap',
        props: {
          variant: 'multi-user',
          users: [
            {
              name: 'Brooj',
              imageUrl: 'https://avatar.iran.liara.run/public'
            },
            {
              name: 'Jane Doe',
              imageUrl: 'https://avatar.iran.liara.run/public'
            },
            { name: 'Burooj' }
          ],
          count: 100,
          showZap: true
        }
      }
    ]
  },
  {
    name: 'Avatars',
    component: Avatar,
    states: [
      {
        label: 'Small',
        props: {
          imageUrl: 'https://avatar.iran.liara.run/public',
          alt: 'User Avatar',
          size: 'sm'
        }
      },
      {
        label: 'Medium',
        props: {
          imageUrl: 'https://avatar.iran.liara.run/public',
          alt: 'User Avatar',
          size: 'md'
        }
      },
      {
        label: 'Large',
        props: {
          imageUrl: 'https://avatar.iran.liara.run/public',
          alt: 'User Avatar',
          size: 'lg'
        }
      },
      {
        label: 'Fallback',
        props: {
          fallback: 'JD'
        }
      },
      {
        label: 'Extra Large',
        props: {
          imageUrl: 'https://avatar.iran.liara.run/public',
          alt: 'User Avatar',
          size: 'xl'
        }
      }
    ]
  },

  {
    name: 'Badges',
    component: Badge,
    states: [
      {
        label: 'Primary',
        props: {
          children: 'Primary Badge',
          variant: 'primary'
        }
      },
      {
        label: 'Secondary',
        props: {
          children: 'Secondary Badge',
          variant: 'secondary'
        }
      },
      {
        label: 'Muted',
        props: {
          children: 'Muted Badge',
          variant: 'muted'
        }
      },
      {
        label: 'Destructive',
        props: {
          children: 'Destructive Badge',
          variant: 'destructive'
        }
      },
      {
        label: 'Success',
        props: {
          children: 'Success Badge',
          variant: 'success'
        }
      },
      {
        label: 'Warning',
        props: {
          children: 'Warning Badge',
          variant: 'warning'
        }
      }
    ]
  },
  {
    name: 'Fields',
    component: Field,
    states: [
      {
        label: 'Default',
        props: {
          name: 'username'
        }
      },
      {
        label: 'With Type',
        props: {
          label: 'Email',
          name: 'email',
          type: 'email',
          placeholder: 'Enter your email'
        }
      },
      {
        label: 'Disabled',
        props: {
          label: 'Password',
          name: 'password',
          type: 'password',
          disabled: true,
          placeholder: 'Enter your password'
        }
      },
      {
        label: 'With Icons',
        props: {
          label: 'Search',
          name: 'search',
          type: 'search',
          placeholder: 'Search...',
          leftIcon: 'search',
          rightIcon: 'xIcon'
        }
      }
    ]
  },
  {
    name: 'Ranking Table',
    component: RankingTable,
    fullWidth: true,
    states: [
      {
        label: 'Ranking Table',
        props: {}
      }
    ]
  },
  {
    name: 'Dual Ranking Table',
    component: DualRankingTable,
    fullWidth: true,
    states: [
      {
        label: 'Dual Ranking Table',
        props: {}
      }
    ]
  },
  {
    name: 'Category Headers',
    component: CategoryHeader,
    fullWidth: true,
    states: [
      {
        label: 'Default',
        props: {
          title: 'Coffee',
          description:
            "Coffee is a beverage brewed from roasted, ground coffee beans. Darkly colored, bitter, and slightly acidic, coffee has a stimulating effect on humans, primarily due to its caffeine content. It has the highest sales in the world market for hot drinks. Coffee is one of the most popular drinks in the world and can be prepared and presented in a variety of ways. The effect of coffee on human health has been a subject of many studies; however, results have varied in terms of coffee's relative benefit."
        }
      }
    ]
  },
  {
    name: 'Hero',
    component: Hero,
    fullWidth: true,
    states: [
      {
        label: 'Default',
        props: {}
      }
    ]
  }
]

interface ComponentsGuideProps {
  currentTab: string
  onTabChange: (value: string) => void
}

export function ComponentsGuide({
  currentTab,
  onTabChange
}: ComponentsGuideProps) {
  const [animate] = useAutoAnimate()

  return (
    <div className="space-y-8">
      <h2 className="voice-3l mb-12">Components</h2>

      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="w-full"
        ref={animate}
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          {components.map((component) => (
            <TabsTrigger
              key={component.name}
              value={component.name.toLowerCase()}
            >
              {component.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-12">
          <div className="space-y-12">
            {components.map((componentGroup, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <h3 className="voice-2l">{componentGroup.name}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {componentGroup.states.map((state, stateIndex) => {
                    const Component = componentGroup.component
                    return (
                      <li
                        key={stateIndex}
                        className={cn({
                          'col-span-full': componentGroup.fullWidth
                        })}
                      >
                        <Card className="border-base-900">
                          <CardHeader>
                            <CardTitle className="voice-sm font-bold">
                              {state.label}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex items-center justify-center min-h-[100px]">
                            <Component {...state.props} />
                          </CardContent>
                        </Card>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>

        {components.map((component) => (
          <TabsContent
            key={component.name}
            value={component.name.toLowerCase()}
            className="mt-12"
          >
            <div className="space-y-4">
              <h3 className="voice-2l">{component.name}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {component.states.map((state, stateIndex) => {
                  const Component = component.component
                  return (
                    <li
                      key={stateIndex}
                      className={cn({
                        'col-span-full': component.fullWidth
                      })}
                    >
                      <Card className="border-base-900">
                        <CardHeader>
                          <CardTitle className="voice-sm font-bold">
                            {state.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center min-h-[100px]">
                          <Component {...state.props}>
                            {state.children}
                          </Component>
                        </CardContent>
                      </Card>
                    </li>
                  )
                })}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
