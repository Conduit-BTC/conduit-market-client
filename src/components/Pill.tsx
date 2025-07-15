import React from 'react'
import { cn, formatNumber } from '@/lib/utils'
import Avatar from './Avatar'
import Icon from './Icon'

interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const Pill: React.FC<PillProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex items-center rounded-full bg-paper/50 p-2 px-3 gap-2 border border-base whitespace-nowrap',
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
    <Pill className={cn('px-1 py-1 pr-4', className)}>
      <Avatar imageUrl={imageUrl} alt={label} size="lg" />
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
    <Pill className={cn('px-1 py-1 pr-4', className)}>
      <Avatar
        imageUrl={imageUrl}
        alt={storeName}
        size="lg"
      />
      <div className="flex flex-col leading-none">
        <span className="text-xs text-muted-foreground">Shop at</span>
        <span className="font-semibold whitespace-nowrap">{storeName}</span>
      </div>
      <Icon.ChevronRight className="size-5 ml-auto shrink-0 text-muted-foreground" />
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
    <Pill className={cn('px-1 py-1 pr-4', className)}>
      <Avatar imageUrl={imageUrl} alt={name} size={size} />
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
    'text-transparent fill-primary',
    size === 'sm' ? 'size-4' : size === 'lg' ? 'size-8' : 'size-6'
  )

  const getAvatarListItemClasses = (idx: number) =>
    cn({
      'z-1': idx === 1, // middle avatar with yellow ring
      'z-2': idx === 2, // rightmost avatar on top
      'z-0': idx === 0 // leftmost avatar
    })

  return (
    <Pill className={cn('px-1 py-1 pr-4', className)}>
      <ul className="flex -space-x-2">
        {imageUrls.map((imageUrl, idx) => (
          <li key={idx} className={getAvatarListItemClasses(idx)}>
            <Avatar
              imageUrl={imageUrl}
              alt={`User ${idx + 1}`}
              size={size}
            />
          </li>
        ))}
      </ul>
      {showZap && <Icon.Zap className={zapClasses} fill="fill-primary" />}
      <p className={numberClasses}>{formatNumber(count)}</p>
    </Pill>
  )
}

interface IconPillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  className?: string
  text: string
  leftIcon?: keyof typeof Icon
  rightIcon?: keyof typeof Icon
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
  size = 'md',
  className
}) => {
  const iconSize = iconSizeClasses[size]
  const textClasses = cn('font-medium', textSizeClasses[size])

  const LeftIcon = leftIcon ? Icon[leftIcon] : null
  const RightIcon = rightIcon ? Icon[rightIcon] : null

  return (
    <Pill className={cn('px-2 py-2 pr-4', className)}>
      {LeftIcon && <LeftIcon className={iconSize} />}
      <span className={textClasses}>{text}</span>
      {RightIcon && <RightIcon className={iconSize} />}
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
