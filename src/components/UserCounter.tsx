import React from 'react'
import UserAvatar from './UserAvatar'
import { Zap } from 'lucide-react'

interface UserCounterProps {
  users: Record<string, any>[] // expects exactly 3 users
  count: number
  showZap?: boolean
}

const UserCounter: React.FC<UserCounterProps> = ({
  users,
  count,
  showZap = false
}) => {
  return (
    <div className="flex items-center rounded-full bg-paper/50 px-3 py-1 gap-2 border border-muted">
      <ul className="flex -space-x-2">
        {users.map((user, idx) => (
          <li
            key={idx}
            className={
              idx === 1
                ? 'z-10' // middle avatar with yellow ring
                : idx === 2
                ? 'z-20' // rightmost avatar on top
                : 'z-0' // leftmost avatar
            }
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
