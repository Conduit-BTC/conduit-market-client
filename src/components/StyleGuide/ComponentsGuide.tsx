import UserAvatar from '../UserAvatar'
import UserCounter from '../UserCounter'
import { Badge } from '../Badge'
import { CardsGuide } from './CardsGuide'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../Cards/CardComponents'
import { cn } from '@/lib/utils'

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
    name: 'Avatars',
    component: UserAvatar,
    states: [
      {
        label: 'Default',
        props: {
          name: 'User Avatar',
          imageUrl: 'https://avatar.iran.liara.run/public'
        }
      },
      {
        label: 'Small without name',
        props: {
          name: 'User Avatar',
          imageUrl: 'https://avatar.iran.liara.run/public',
          size: 5,
          showName: false
        }
      },
      {
        label: 'Large without name',
        props: {
          name: 'User Avatar',
          size: 10,
          showName: false
        }
      }
    ]
  },
  {
    name: 'User Counters',
    component: UserCounter,
    states: [
      {
        label: 'Default Counter',
        props: {
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
        label: 'Counter with Zap',
        props: {
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
