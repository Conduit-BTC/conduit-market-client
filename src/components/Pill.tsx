import React from 'react'
import { cn, formatNumber } from '@/lib/utils'
import { ChevronRight, Zap } from 'lucide-react'
import Avatar from './Avatar'

interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const Pill: React.FC<PillProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex items-center rounded-full bg-paper/50 px-1 py-1 pr-4 gap-2 border border-base',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CategoryPillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  imageUrl?: string | null
  label: string
}

const CategoryPill: React.FC<CategoryPillProps> = ({
  imageUrl,
  label,
  className,
  ...props
}) => {
  return (
    <Pill>
      <Avatar imageUrl={imageUrl} alt={label} size="lg" fallback={label} />
      <span className="font-semibold">{label}</span>
    </Pill>
  )
}

interface StorePillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  imageUrl?: string | null
  storeName: string
}

const StorePill: React.FC<StorePillProps> = ({
  imageUrl,
  storeName,
  className,
  ...props
}) => {
  return (
    <Pill>
      <Avatar
        imageUrl={imageUrl}
        alt={storeName}
        size="lg"
        fallback={storeName}
      />
      <div className="flex flex-col leading-none">
        <span className="text-xs text-muted-foreground">Shop at</span>
        <span className="font-semibold">{storeName}</span>
      </div>
      <ChevronRight className="size-5 ml-auto text-muted-foreground" />
    </Pill>
  )
}

interface UserPillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const UserPill: React.FC<UserPillProps> = ({
  name,
  imageUrl,
  size = 'md',
  className,
  ...props
}) => {
  const userNameClasses = cn(
    'font-medium',
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
  )

  return (
    <Pill className={className}>
      <Avatar imageUrl={imageUrl} alt={name} size={size} fallback={name} />
      <span className={userNameClasses}>{name}</span>
    </Pill>
  )
}

interface MultiUserPillProps {
  imageUrls?: string[] // expects exactly 3 users
  count?: number
  showZap?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const MultiUserPill: React.FC<MultiUserPillProps> = ({
  imageUrls = [null, null, null],
  count = 100,
  showZap = false,
  size = 'md',
  className
}) => {
  const numberClasses = cn(
    'font-bold',
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
  )
  const zapClasses = cn(
    'text-transparent',
    size === 'sm' ? 'size-4' : size === 'lg' ? 'size-8' : 'size-6'
  )

  const getAvatarListItemClasses = (idx: number) =>
    cn({
      'z-1': idx === 1, // middle avatar with yellow ring
      'z-2': idx === 2, // rightmost avatar on top
      'z-0': idx === 0 // leftmost avatar
    })

  return (
    <Pill className={className}>
      <ul className="flex -space-x-2">
        {imageUrls.map((imageUrl, idx) => (
          <li key={idx} className={getAvatarListItemClasses(idx)}>
            <Avatar
              imageUrl={imageUrl}
              alt={`User ${idx + 1}`}
              size={size}
              fallback={`User ${idx + 1}`}
            />
          </li>
        ))}
      </ul>
      {showZap && (
        <Zap className={zapClasses} fill="var(--color-primary-400)" />
      )}
      <p className={numberClasses}>{formatNumber(count)}</p>
    </Pill>
  )
}

interface IconPillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  text: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const iconSizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-9'
} as const

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
} as const

const IconPill: React.FC<IconPillProps> = ({
  text,
  leftIcon,
  rightIcon,
  size = 'md'
}) => {
  const iconSize = iconSizeClasses[size]
  const textClasses = cn('font-medium', textSizeClasses[size])

  return (
    <Pill>
      {leftIcon && <picture className={iconSize}>{leftIcon}</picture>}
      <span className={textClasses}>{text}</span>
      {rightIcon && <picture className={iconSize}>{rightIcon}</picture>}
    </Pill>
  )
}

export { Pill, CategoryPill, StorePill, UserPill, MultiUserPill, IconPill }
export type {
  PillProps,
  CategoryPillProps,
  StorePillProps,
  UserPillProps,
  MultiUserPillProps,
  IconPillProps
}
