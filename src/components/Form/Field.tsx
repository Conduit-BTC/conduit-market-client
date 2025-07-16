import * as React from 'react'
import { cn } from '@/lib/utils'
import Input from './Input'
import Icon from '../Icon'
import { Badge } from '../Badge'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './Dropdown'

// Tag component for displaying selected items in tags mode
const Tag = ({
  label,
  onRemove,
  disabled
}: {
  label: string
  onRemove: () => void
  disabled?: boolean
}) => {
  return (
    <Badge variant="secondary" className="inline-flex items-center gap-1 pr-1">
      <span>{label}</span>
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-secondary/20 rounded-sm p-0.5 transition-colors ml-1"
        >
          <Icon.X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  )
}

export type FieldProps = {
  label?: string
  labelClassName?: string
  name: string
  type?:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'dropdown'
    | 'select'
    | 'tags'
    | 'textarea'
    | 'file'
  required?: boolean
  help?: string
  error?: string
  options?: string[] | { label: string; value: string }[]
  className?: string
  inputWrapperClassName?: string
  inputClassName?: string
  disabled?: boolean
  hidden?: boolean
  placeholder?: string
  rightIcon?: keyof typeof Icon
  leftIcon?: keyof typeof Icon
  // For tags/multi-select support
  value?: string | string[]
  onChange?: (event: {
    target: { name: string; value: string | string[] }
  }) => void
  // For enhanced tags functionality
  onAddTag?: (tag: string) => void
  onRemoveTag?: (tag: string) => void
  allowNewTags?: boolean
} & Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> &
  Omit<React.ComponentProps<'select'>, 'value' | 'onChange'> &
  Omit<React.ComponentProps<'textarea'>, 'value' | 'onChange'>

const Field = React.forwardRef<
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement,
  FieldProps
>(
  (
    {
      label,
      labelClassName,
      name,
      type = 'text',
      required,
      help,
      error,
      options,
      className,
      inputWrapperClassName,
      inputClassName,
      disabled,
      hidden,
      placeholder,
      rightIcon,
      leftIcon,
      value,
      onChange,
      onAddTag,
      onRemoveTag,
      allowNewTags = true,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const [parent] = useAutoAnimate()
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
      type === 'tags' ? 'p-2 pl-4 min-h-[42px]' : 'p-2 pl-4',

      // Borders & Shape
      'rounded-lg border',

      // Error styling
      error ? 'border-red-500' : 'border-base-700',

      // Colors & Background
      'bg-base-900',

      // Typography
      'voice-base',

      // Interactive States
      'shadow-sm transition-colors focus-within:outline-none focus-within:ring-1',
      error ? 'focus-within:ring-red-500' : 'focus-within:ring-ring',

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

    // Helper function to get option value and label
    const getOptionDetails = (
      option: string | { label: string; value: string }
    ) => {
      if (typeof option === 'string') {
        return { value: option, label: option }
      }
      return { value: option.value, label: option.label }
    }

    // Helper function to handle tag removal
    const handleTagRemove = (valueToRemove: string) => {
      if (!onChange || disabled) return

      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.filter((v) => v !== valueToRemove)

      onChange({
        target: { name, value: newValues }
      })
    }

    // Helper function to handle tag selection/deselection
    const handleTagToggle = (optionValue: string) => {
      if (!onChange || disabled) return

      const currentValues = Array.isArray(value) ? value : []
      const isSelected = currentValues.includes(optionValue)

      const newValues = isSelected
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue]

      onChange({
        target: { name, value: newValues }
      })
    }

    const renderFormElement = () => {
      if (type === 'tags') {
        const [inputValue, setInputValue] = React.useState('')
        const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
        const [isFocused, setIsFocused] = React.useState(false)
        const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
        const selectedValues = Array.isArray(value) ? value : []
        const inputRef = React.useRef<HTMLInputElement>(null)
        const containerRef = React.useRef<HTMLDivElement>(null)

        // Filter options based on input value
        const availableOptions =
          options?.filter((option) => {
            const { value: optionValue, label: optionLabel } =
              getOptionDetails(option)
            // Don't show already selected options
            if (selectedValues.includes(optionValue)) return false
            // Filter by search term
            if (inputValue.trim() === '') return true
            return optionLabel.toLowerCase().includes(inputValue.toLowerCase())
          }) || []

        // Handle adding a new tag
        const handleAddTag = (tagValue: string) => {
          const trimmedValue = tagValue.trim()
          if (
            !trimmedValue ||
            selectedValues.includes(trimmedValue) ||
            disabled
          )
            return

          if (onAddTag) {
            onAddTag(trimmedValue)
          } else if (onChange) {
            onChange({
              target: { name, value: [...selectedValues, trimmedValue] }
            })
          }

          setInputValue('')
          setIsDropdownOpen(false)
        }

        // Handle removing a tag
        const handleRemoveTag = (tagValue: string) => {
          if (disabled) return

          if (onRemoveTag) {
            onRemoveTag(tagValue)
          } else if (onChange) {
            const newValues = selectedValues.filter((v) => v !== tagValue)
            onChange({
              target: { name, value: newValues }
            })
          }
        }

        // Handle selecting from dropdown
        const handleSelectOption = (optionValue: string) => {
          handleAddTag(optionValue)
        }

        // Handle input changes
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.currentTarget.value
          setInputValue(newValue)
          // Reset highlighted index when typing
          setHighlightedIndex(-1)
          // Update available options based on new input
          const filteredOptions =
            options?.filter((option) => {
              const { value: optionValue, label: optionLabel } =
                getOptionDetails(option)
              // Don't show already selected options
              if (selectedValues.includes(optionValue)) return false
              // Filter by search term
              if (newValue.trim() === '') return true
              return optionLabel.toLowerCase().includes(newValue.toLowerCase())
            }) || []

          setIsDropdownOpen(newValue.length > 0 || filteredOptions.length > 0)
        }

        // Handle keyboard events
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (highlightedIndex >= 0 && availableOptions[highlightedIndex]) {
              // Select highlighted option
              const { value: optionValue } = getOptionDetails(
                availableOptions[highlightedIndex]
              )
              handleSelectOption(optionValue)
            } else if (inputValue.trim() && allowNewTags) {
              // Add new tag
              handleAddTag(inputValue)
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!isDropdownOpen && availableOptions.length > 0) {
              setIsDropdownOpen(true)
            }
            setHighlightedIndex((prev) =>
              prev < availableOptions.length - 1 ? prev + 1 : 0
            )
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (!isDropdownOpen && availableOptions.length > 0) {
              setIsDropdownOpen(true)
            }
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : availableOptions.length - 1
            )
          } else if (e.key === 'Escape') {
            setIsDropdownOpen(false)
            setHighlightedIndex(-1)
            inputRef.current?.blur()
          }
        }

        // Get selected options for display (including new tags that aren't in options)
        const selectedTags = selectedValues.map((val) => {
          const option = options?.find(
            (opt) => getOptionDetails(opt).value === val
          )
          return option ? getOptionDetails(option) : { value: val, label: val }
        })

        return (
          <div ref={containerRef} className="w-full">
            {/* Input Field */}
            <div className="relative">
              <input
                ref={inputRef}
                id={id}
                name={name}
                type="text"
                disabled={disabled}
                placeholder={placeholder ?? 'Type to search or add...'}
                className={cn(inputClassNames, 'pr-8')}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsFocused(true)
                  setIsDropdownOpen(
                    inputValue.length > 0 || availableOptions.length > 0
                  )
                }}
                onBlur={(e) => {
                  // Delay to allow clicking on dropdown items
                  setTimeout(() => {
                    setIsFocused(false)
                    setIsDropdownOpen(false)
                    setHighlightedIndex(-1)
                  }, 200)
                }}
              />

              {/* Dynamic Icon - Plus when focused, ChevronDown when not */}
              {isFocused ? (
                <button
                  type="button"
                  disabled={disabled || !inputValue.trim() || !allowNewTags}
                  onClick={() => inputValue.trim() && handleAddTag(inputValue)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-secondary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon.Plus className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    inputRef.current?.focus()
                    setIsDropdownOpen(availableOptions.length > 0)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-secondary/20 transition-colors"
                >
                  <Icon.ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              )}

              {/* Custom Dropdown - styled like DropdownMenuContent */}
              {isDropdownOpen && availableOptions.length > 0 && (
                <div
                  style={{ width: containerRef.current?.offsetWidth }}
                  className="absolute top-full left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                  onMouseDown={(e) => {
                    // Prevent input from losing focus when clicking dropdown
                    e.preventDefault()
                  }}
                >
                  {availableOptions.map((option, index) => {
                    const { value: optionValue, label: optionLabel } =
                      getOptionDetails(option)
                    const isHighlighted = index === highlightedIndex
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          handleSelectOption(optionValue)
                          inputRef.current?.focus()
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={cn(
                          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                          isHighlighted
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {optionLabel}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedTags.map((tag) => (
                  <Tag
                    key={tag.value}
                    label={tag.label}
                    disabled={disabled}
                    onRemove={() => handleRemoveTag(tag.value)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      }

      if (type === 'dropdown') {
        const [isOpen, setIsOpen] = React.useState(false)
        const selectedOption = options?.find(
          (option) => getOptionDetails(option).value === value
        )
        const displayLabel = selectedOption
          ? getOptionDetails(selectedOption).label
          : placeholder ?? 'Select an option'

        return (
          <DropdownMenu onOpenChange={setIsOpen}>
            <DropdownMenuTrigger
              ref={ref as React.RefObject<HTMLButtonElement>}
              id={id}
              name={name}
              disabled={disabled}
              className={cn(
                inputClassNames,
                'w-full text-left flex items-center justify-between'
              )}
            >
              <span>{displayLabel}</span>
              <Icon.ChevronDown
                className={cn(
                  'h-4 w-4 opacity-50 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {options?.map((option, index) => {
                const { value: optionValue, label: optionLabel } =
                  getOptionDetails(option)
                return (
                  <DropdownMenuItem
                    key={index}
                    onSelect={() => {
                      if (onChange) {
                        onChange({
                          target: { value: optionValue, name }
                        })
                      }
                    }}
                  >
                    {optionLabel}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }

      if (type === 'select') {
        return (
          <select
            id={id}
            ref={ref as React.RefObject<HTMLSelectElement>}
            name={name}
            disabled={disabled}
            className={inputClassNames}
            value={value as string}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onChange?.({ target: { name, value: e.currentTarget.value } })
            }
            {...(props as React.ComponentProps<'select'>)}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((option, index) => {
              const { value: optionValue, label: optionLabel } =
                getOptionDetails(option)
              return (
                <option key={index} value={optionValue}>
                  {optionLabel}
                </option>
              )
            })}
          </select>
        )
      }

      if (type === 'textarea') {
        return (
          <textarea
            id={id}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            name={name}
            disabled={disabled}
            placeholder={placeholder ?? label}
            className={cn(inputClassNames, 'min-h-[80px] resize-y')}
            value={value as string}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onChange?.({ target: { name, value: e.currentTarget.value } })
            }
            {...(props as React.ComponentProps<'textarea'>)}
          />
        )
      }

      return (
        <Input
          id={id}
          ref={ref as React.RefObject<HTMLInputElement>}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder ?? label}
          className={inputClassNames}
          value={value as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange?.({ target: { name, value: e.currentTarget.value } })
          }
          {...(props as React.ComponentProps<'input'>)}
        />
      )
    }

    const LeftIcon = leftIcon ? Icon[leftIcon] : null
    const RightIcon = rightIcon ? Icon[rightIcon] : null

    return (
      <div ref={parent} className={containerClassNames}>
        {label && (
          <label htmlFor={id} className={labelClassNames}>
            {label}
            {required && <span className="text-secondary ml-1">*</span>}
          </label>
        )}
        <div className={inputWrapperClassNames}>
          {LeftIcon && <LeftIcon className="absolute left-2" />}
          {renderFormElement()}
          {RightIcon && <RightIcon className="absolute right-2" />}
        </div>
        {error && (
          <p className="text-destructive-foreground voice-sm mt-1">{error}</p>
        )}
        {help && !error && (
          <p className="text-muted-foreground voice-sm mt-1">{help}</p>
        )}
      </div>
    )
  }
)

Field.displayName = 'Field'

export default Field
