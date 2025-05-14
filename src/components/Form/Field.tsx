import * as React from 'react'
import { cn } from '@/lib/utils'
import Input from './Input'

export type FieldProps = {
  label?: string
  name: string
  type?: string
  className?: string
  disabled?: boolean
  hidden?: boolean
  placeholder?: string
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
} & React.ComponentProps<'input'>

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  (
    {
      label,
      name,
      type = 'text',
      className,
      disabled,
      hidden,
      placeholder,
      rightIcon,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const id = React.useId()

    const containerClassNames = cn('grid gap-1 relative', className, {
      'cursor-not-allowed opacity-50': disabled,
      hidden: hidden
    })

    const labelClassNames = cn(
      // Typography - Using design system voice level for consistent text styling
      'solid-voice',

      // Add any conditional classes if needed
      {
        'sr-only': hidden // Accessibility: Hide label visually but keep for screen readers if field is hidden
      }
    )

    const inputWrapperClassNames = cn(
      // Position & Layout
      'relative flex items-center',

      // Spacing
      'p-2',

      // Borders & Shape
      'rounded-lg border border-base-400',

      // Colors & Background
      'bg-base-900',

      // Typography
      'calm-voice',

      // Interactive States
      'shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',

      // File Input Specific Styles
      {
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground':
          type === 'file'
      }
    )

    const inputClassNames = cn('w-full bg-transparent outline-none', {
      'pl-6': leftIcon,
      'pr-6': rightIcon
    })

    return (
      <div className={containerClassNames}>
        {label && (
          <label htmlFor={id} className={labelClassNames}>
            {label}
          </label>
        )}
        <div className={inputWrapperClassNames}>
          {leftIcon && <div className="absolute left-2">{leftIcon}</div>}
          <Input
            id={id}
            ref={ref}
            name={name}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            className={inputClassNames}
            {...props}
          />
          {rightIcon && <div className="absolute right-2">{rightIcon}</div>}
        </div>
      </div>
    )
  }
)

Field.displayName = 'Field'

export default Field
