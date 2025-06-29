import React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  picture?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  npub?: string
  href?: string
  className?: string
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24'
}

const Avatar: React.FC<AvatarProps> = ({
  picture,
  alt,
  size = 'md',
  npub,
  href,
  className
}) => {
  const sizeClass =
    typeof size === 'number'
      ? `w-[${size}px] h-[${size}px]`
      : sizeMap[size] || sizeMap.md
  const avatarImg = (
    <img
      src={picture || '/public/images/logo/logo-icon.svg'}
      alt={alt || 'Avatar'}
      className={`rounded-full object-cover bg-primary-800 border border-primary-700 ${sizeClass} ${
        className || ''
      }`}
    />
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {avatarImg}
      </a>
    )
  }
  return avatarImg
}

export default Avatar
