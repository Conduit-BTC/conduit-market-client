import * as React from 'react'
import { cn } from '@/lib/utils'
import Input from './Input'
import Icon, { type IconName } from '../Icon'

export type FieldProps = {
  label?: string
  labelClassName?: string
  name: string
  type?: string
  className?: string
  inputWrapperClassName?: string
  inputClassName?: string
  disabled?: boolean
  hidden?: boolean
  placeholder?: string
  rightIcon?: IconName
  leftIcon?: IconName
} & React.ComponentProps<'input'>

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  (
    {
      label,
      labelClassName,
      name,
      type = 'text',
      className,
      inputWrapperClassName,
      inputClassName,
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

    const containerClassNames = cn(
      'grid gap-1 relative',
      {
        'cursor-not-allowed opacity-50': disabled,
        hidden: hidden
      },
      className
    )

    const labelClassNames = cn(
      // Typography - Using design system voice level for consistent text styling
      'voice-sm font-bold',
      labelClassName,

      // Add any conditional classes if needed
      {
        'sr-only': hidden // Accessibility: Hide label visually but keep for screen readers if field is hidden
      }
    )

    const inputWrapperClassNames = cn(
      // Position & Layout
      'relative flex items-center',

      // Spacing
      'p-2 pl-4',

      // Borders & Shape
      'rounded-lg border border-base-700',

      // Colors & Background
      'bg-base-900',

      // Typography
      'voice-base',

      // Interactive States
      'shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',

      // File Input Specific Styles
      {
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground':
          type === 'file'
      },

      inputWrapperClassName
    )

    const inputClassNames = cn(
      'w-full bg-transparent outline-none',
      {
        'pl-6': leftIcon,
        'pr-6': rightIcon
      },
      inputClassName
    )

    return (
      <div className={containerClassNames}>
        {label && (
          <label htmlFor={id} className={labelClassNames}>
            {label}
          </label>
        )}
        <div className={inputWrapperClassNames}>
          {leftIcon && <Icon icon={leftIcon} className="absolute left-2" />}
          <Input
            id={id}
            ref={ref}
            name={name}
            type={type}
            disabled={disabled}
            placeholder={placeholder ?? label}
            className={inputClassNames}
            {...props}
          />
          {rightIcon && <Icon icon={rightIcon} className="absolute right-2" />}
        </div>
      </div>
    )
  }
)

Field.displayName = 'Field'

export default Field
