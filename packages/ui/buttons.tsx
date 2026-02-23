import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

/**
 * Ani-Green signature button component
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-ani-green-600 text-white hover:bg-ani-green-700 focus:ring-ani-green-500',
    secondary: 'bg-ani-green-100 text-ani-green-800 hover:bg-ani-green-200 focus:ring-ani-green-500',
    outline: 'border-2 border-ani-green-600 text-ani-green-600 hover:bg-ani-green-50 focus:ring-ani-green-500',
    ghost: 'text-ani-green-600 hover:bg-ani-green-50 focus:ring-ani-green-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
