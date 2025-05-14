import React from 'react'
import UserAvatar from './UserAvatar'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserCounterProps {
  users?: Record<string, any>[] // expects exactly 3 users
  count?: number
  showZap?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const UserCounter: React.FC<UserCounterProps> = ({
  users = [1, 2, 3],
  count = 100,
  showZap = false,
  size = 'md'
}) => {
  const avatarSize = size === 'sm' ? 4 : size === 'lg' ? 8 : 6
  const numberSize = cn(
    'font-bold',
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
  )
  const zapSize = cn(
    'text-transparent',
    size === 'sm' ? 'size-4' : size === 'lg' ? 'size-8' : 'size-6'
  )

  return (
    <div className="flex items-center rounded-full bg-paper/50 p-1 gap-2 border border-muted">
      <ul className="flex -space-x-2">
        {users.map((user, idx) => (
          <li
            key={idx}
            className={cn({
              'z-1': idx === 1, // middle avatar with yellow ring
              'z-2': idx === 2, // rightmost avatar on top
              'z-0': idx === 0 // leftmost avatar
            })}
          >
            <UserAvatar
              name={user.name}
              imageUrl={user.imageUrl}
              size={avatarSize}
              showName={false}
            />
          </li>
        ))}
      </ul>
      {showZap && <Zap className={zapSize} fill="var(--color-primary-400)" />}
      <p className={numberSize}>{count.toLocaleString()}</p>
    </div>
  )
}

export default UserCounter
