import React from 'react'
import UserAvatar from './UserAvatar'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserCounterProps {
  users: Record<string, any>[] // expects exactly 3 users
  count: number
  showZap?: boolean
}

const UserCounter: React.FC<UserCounterProps> = ({
  users = [1, 2, 3],
  count = 100,
  showZap = false
}) => {
  return (
    <div className="flex items-center rounded-full bg-paper/50 px-3 py-1 gap-2 border border-muted">
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
              size={6}
              showName={false}
            />
          </li>
        ))}
      </ul>
      {showZap && (
        <Zap
          className="size-6 text-transparent"
          fill="var(--color-primary-400)"
        />
      )}
      <p className="firm-voice">{count.toLocaleString()}</p>
    </div>
  )
}

export default UserCounter
