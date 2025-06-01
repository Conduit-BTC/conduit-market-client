interface ColorSwatchProps {
  name: string
  variable: string
  category: string
}

type ColorCategory = {
  [key: string]: string
}

type ColorScheme = {
  [category: string]: ColorCategory
}

const colors: ColorScheme = {
  base: {
    paper: 'bg-paper',
    ink: 'bg-ink',
    50: 'bg-base-50',
    100: 'bg-base-100',
    150: 'bg-base-150',
    200: 'bg-base-200',
    300: 'bg-base-300',
    400: 'bg-base-400',
    500: 'bg-base-500',
    600: 'bg-base-600',
    700: 'bg-base-700',
    800: 'bg-base-800',
    900: 'bg-base-900',
    950: 'bg-base-950'
  },
  muted: {
    base: 'bg-muted',
    foreground: 'text-muted-foreground'
  },
  primary: {
    50: 'bg-primary-50',
    100: 'bg-primary-100',
    200: 'bg-primary-200',
    300: 'bg-primary-300',
    400: 'bg-primary-400',
    500: 'bg-primary-500',
    600: 'bg-primary-600',
    700: 'bg-primary-700',
    800: 'bg-primary-800',
    900: 'bg-primary-900',
    950: 'bg-primary-950',
    base: 'bg-primary',
    foreground: 'text-primary-foreground'
  },
  secondary: {
    50: 'bg-secondary-50',
    100: 'bg-secondary-100',
    200: 'bg-secondary-200',
    300: 'bg-secondary-300',
    400: 'bg-secondary-400',
    500: 'bg-secondary-500',
    600: 'bg-secondary-600',
    700: 'bg-secondary-700',
    800: 'bg-secondary-800',
    900: 'bg-secondary-900',
    950: 'bg-secondary-950',
    base: 'bg-secondary',
    foreground: 'text-secondary-foreground'
  },
  tertiary: {
    50: 'bg-tertiary-50',
    100: 'bg-tertiary-100',
    200: 'bg-tertiary-200',
    300: 'bg-tertiary-300',
    400: 'bg-tertiary-400',
    500: 'bg-tertiary-500',
    600: 'bg-tertiary-600',
    700: 'bg-tertiary-700',
    800: 'bg-tertiary-800',
    900: 'bg-tertiary-900',
    950: 'bg-tertiary-950',
    base: 'bg-tertiary',
    foreground: 'text-tertiary-foreground'
  },
  accent: {
    50: 'bg-accent-50',
    100: 'bg-accent-100',
    200: 'bg-accent-200',
    300: 'bg-accent-300',
    400: 'bg-accent-400',
    500: 'bg-accent-500',
    600: 'bg-accent-600',
    700: 'bg-accent-700',
    800: 'bg-accent-800',
    900: 'bg-accent-900',
    950: 'bg-accent-950',
    base: 'bg-accent',
    foreground: 'text-accent-foreground'
  },

  status: {
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    info: 'bg-info text-info-foreground',
    destructive: 'bg-destructive text-destructive-foreground'
  },

  gradient: {
    primary:
      'bg-gradient-to-b from-primary-500 to-primary text-primary-foreground',
    secondary:
      'bg-gradient-to-b from-secondary-500 to-secondary text-secondary-foreground',
    tertiary:
      'bg-gradient-to-b from-tertiary-500 to-tertiary text-tertiary-foreground',
    accent: 'bg-gradient-to-b from-accent-500 to-accent text-accent-foreground',
    'a-p': 'bg-gradient-to-b from-accent to-primary',
    'a-t': 'bg-gradient-to-b from-accent to-tertiary',
    'p-s': 'bg-gradient-to-b from-primary to-secondary'
  },

  border: {
    base: 'border border-base',
    muted: 'border border-muted',
    primary: 'border border-primary',
    secondary: 'border border-secondary',
    tertiary: 'border border-tertiary',
    'glow-p': 'border border-ink/40 shadow-border-glow shadow-primary',
    'glow-s': 'border border-ink/40 shadow-border-glow shadow-secondary',
    'glow-t': 'border border-ink/40 shadow-border-glow shadow-tertiary',
    'glow-a': 'border border-ink/40 shadow-border-glow shadow-accent'
  },

  shadow: {
    'p-xs': 'shadow-primary shadow-xs',
    'p-2xl': 'shadow-primary shadow-2xl',
    's-xs': 'shadow-secondary shadow-xs',
    's-2xl': 'shadow-secondary shadow-2xl',
    't-xs': 'shadow-tertiary shadow-xs',
    't-2xl': 'shadow-tertiary shadow-2xl',
    'a-xs': 'shadow-accent shadow-xs',
    'a-2xl': 'shadow-accent shadow-2xl'
  }
}

function ColorSwatch({ name, variable, category }: ColorSwatchProps) {
  const displayName =
    name === 'base' ? 'Base' : name.charAt(0).toUpperCase() + name.slice(1)

  // Get the corresponding foreground color based on the color category
  const foregroundColor = colors[category].foreground

  return (
    <div className="">
      <div
        className={`w-20 aspect-square rounded-lg flex items-center justify-center ${variable} ${foregroundColor}`}
        role="presentation"
        aria-label={`${displayName} color swatch`}
      >
        <p className="voice-xs">{displayName}</p>
      </div>
      <div className="space-y-1"></div>
    </div>
  )
}

export function ColorGuide() {
  return (
    <div className="space-y-8" role="region" aria-label="Color guide">
      <h2 className="voice-3l mb-6">Colors</h2>

      {Object.entries(colors).map(([category, value]) => {
        const categoryName =
          category.charAt(0).toUpperCase() + category.slice(1)
        return (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium">{categoryName} Colors</h3>
            <p className="voice-xs font-mono">--color-{category}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(value).map(([subKey, subValue]) => (
                <ColorSwatch
                  key={`${category}-${subKey}`}
                  name={subKey}
                  variable={subValue}
                  category={category}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
