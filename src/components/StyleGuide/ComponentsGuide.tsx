import { Badge } from '../Badge'
import { CardsGuide } from './CardsGuide'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../Cards/CardComponents'
import { cn } from '@/lib/utils'
import Breadcrumbs from '../Breadcumbs'
import Field from '../Form/Field'
import { SearchIcon, XIcon } from 'lucide-react'
import RankingTable from '../RankingTable'
import {
  Pill,
  CategoryPill,
  StorePill,
  UserPill,
  MultiUserPill,
  IconPill
} from '../Pill'
import Avatar from '../Avatar'

interface Component {
  name: string
  component: React.ComponentType<any>
  fullWidth?: boolean
  states: {
    label: string
    props: any
  }[]
}

const components: Component[] = [
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
          leftIcon: <SearchIcon />
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
    name: 'Breadcrumbs',
    component: Breadcrumbs,
    states: [
      {
        label: 'Default',
        props: {
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
          leftIcon: <SearchIcon className="w-4 h-4 text-base-400" />,
          rightIcon: <XIcon className="w-4 h-4 text-base-400" />
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
        label: 'Default',
        props: {}
      }
    ]
  }
]

export function ComponentsGuide() {
  return (
    <div className="space-y-8">
      <h2 className="attention-voice mb-6">Components</h2>

      {components.map((componentGroup, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          <h3 className="firm-voice">{componentGroup.name}</h3>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="solid-voice">
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

      {/* Cards */}
      <CardsGuide />
    </div>
  )
}
