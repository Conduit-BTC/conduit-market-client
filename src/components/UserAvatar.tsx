import React from 'react'

interface UserAvatarProps {
  name?: string
  imageUrl?: string
  size?: number
  showName?: boolean
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  imageUrl,
  size = 10,
  showName = true
}) => {
  const sizeClass = `w-${size} h-${size}`

  return (
    <div className="flex items-center gap-1">
      <picture className={`${sizeClass} rounded-full relative bg-gray-800`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || 'User Avatar'}
            className="object-cover"
          />
        ) : (
          <p className="text-ink leading-none font-bold text-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </p>
        )}
      </picture>
      {showName && name && <p className="calm-voice font-medium">{name}</p>}
    </div>
  )
}

export default UserAvatar
