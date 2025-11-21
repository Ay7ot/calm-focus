'use client'

interface UserAvatarProps {
  email?: string
  username?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function UserAvatar({ email, username, size = 'md' }: UserAvatarProps) {
  const displayName = username || email || 'U'
  const initial = displayName.charAt(0).toUpperCase()
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold`}>
      {initial}
    </div>
  )
}

