import { cn } from '@/lib/utils'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Cards/CardComponents'

// should show the families at top #todo
// then the varius weights we are using
// then the line heights
// then the font sizes

const families = [
  {
    name: 'ABC Whyte Inktrap',
    twClass: 'font-display',
    role: 'Display Typeface',
    description:
      'The ABC Whyte Inktrap is a display typeface that is used for headings and titles.'
  },
  {
    name: 'Poppins',
    twClass: 'font-body',
    role: 'Body Typeface',
    description:
      'The Poppins is a body typeface that is used for paragraphs and text.'
  },
  {
    name: 'Whyte Mono Inktrap',
    twClass: 'font-mono',
    role: 'Mono Typeface',
    description:
      'The Whyte Mono Inktrap is a monospace typeface that is used for code and other technical text.'
  }
]

const weights = [
  {
    name: 'Light',
    variable: '--font-weight-light',
    twClass: 'font-light'
  },
  {
    name: 'Normal',
    variable: '--font-weight-normal',
    twClass: 'font-normal'
  },
  {
    name: 'Medium',
    variable: '--font-weight-medium',
    twClass: 'font-medium'
  },
  {
    name: 'Semibold',
    variable: '--font-weight-semibold',
    twClass: 'font-semibold'
  },
  {
    name: 'Bold',
    variable: '--font-weight-bold',
    twClass: 'font-bold'
  },
  {
    name: 'Extra Bold',
    variable: '--font-weight-extrabold',
    twClass: 'font-extrabold'
  }
]

const lineHeights = [
  {
    name: 'Tight',
    variable: '--leading-tight',
    twClass: 'leading-tight'
  },
  {
    name: 'Snug',
    variable: '--leading-snug',
    twClass: 'leading-snug'
  },
  {
    name: 'Normal',
    variable: '--leading-normal',
    twClass: 'leading-normal'
  },
  {
    name: 'Relaxed',
    variable: '--leading-relaxed',
    twClass: 'leading-relaxed'
  },
  {
    name: 'Loose',
    variable: '--leading-loose',
    twClass: 'leading-loose'
  }
]

const sizes = [
  {
    name: 'Step -2, xs',
    variable: 'var(--font-size--2)'
  },
  {
    name: 'Step -1, sm',
    variable: 'var(--font-size--1)'
  },
  {
    name: 'Step 0, base',
    variable: 'var(--font-size-0)'
  },
  {
    name: 'Step 1, lg',
    variable: 'var(--font-size-1)'
  },
  {
    name: 'Step 2, 2l',
    variable: 'var(--font-size-2)'
  },
  {
    name: 'Step 3, 3l',
    variable: 'var(--font-size-3)'
  },
  {
    name: 'Step 4, 4l',
    variable: 'var(--font-size-4)'
  },
  {
    name: 'Step 5, 5l',
    variable: 'var(--font-size-5)'
  },
  {
    name: 'Step 6, 6l',
    variable: 'var(--font-size-6)'
  }
]

const voiceClasses = [
  'voice-xs',
  'voice-sm',
  'voice-base',
  'voice-lg',
  'voice-2l',
  'voice-3l',
  'voice-4l',
  'voice-5l',
  'voice-6l'
]

function getFontValues(className: string) {
  if (typeof window === 'undefined') return null

  // Create a temporary element to compute styles
  const tempElement = document.createElement('div')
  tempElement.className = className
  document.body.appendChild(tempElement)

  // Get computed styles
  const computedStyle = window.getComputedStyle(tempElement)
  const fontSize = parseFloat(computedStyle.fontSize)
  const lineHeight = parseFloat(computedStyle.lineHeight)

  const values = {
    fontFamily: computedStyle.fontFamily.split(',')[0],
    fontSize: computedStyle.fontSize,
    lineHeight: `${Math.round((lineHeight / fontSize) * 100)}%`,
    fontWeight: computedStyle.fontWeight
  }

  // Clean up
  document.body.removeChild(tempElement)
  return values
}

function FontFamilies() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Font Families</h2>
      <ul className="grid gap-4 lg:grid-cols-3">
        {families.map((family) => (
          <li key={family.name}>
            <Card className="grid gap-6 ">
              <CardHeader className="grid gap-4">
                <h3 className={cn('text-sm font-bold', family.twClass)}>
                  {family.role}
                </h3>
                <h4 className={cn('text-4xl font-bold', family.twClass)}>
                  {family.name}
                </h4>
                <p
                  className={cn(
                    'text-muted-foreground text-sm',
                    family.twClass
                  )}
                >
                  {family.description}
                </p>
              </CardHeader>

              <CardContent>
                <p className={cn('text-base md:text-2xl', family.twClass)}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </p>
                <p className={cn('text-base md:text-2xl', family.twClass)}>
                  abcdefghijklmnopqrstuvwxyz
                </p>
                <p className={cn('text-base md:text-2xl', family.twClass)}>
                  1234567890!@#$%^&*()
                </p>
              </CardContent>

              <CardFooter>
                <code className={'text-sm font-mono'}>--{family.twClass}</code>
                <code className={'text-sm font-mono'}>.{family.twClass}</code>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FontWeights() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Font Weights</h2>
      <ul className="grid justify-start gap-4">
        {weights.map((weight) => (
          <li key={weight.name}>
            <Card className="grid gap-6 ">
              <CardHeader className="flex justify-around gap-4">
                <p
                  className={cn(
                    'text-5xl font-bold leading-none font-display',
                    weight.twClass
                  )}
                >
                  Aa
                </p>
                <p
                  className={cn(
                    'text-5xl font-bold leading-none font-body',
                    weight.twClass
                  )}
                >
                  Aa
                </p>
              </CardHeader>
              <CardFooter className="grid gap-2 justify-start">
                <code className={'text-sm font-mono'}>{weight.variable}</code>
                <code className={'text-sm font-mono'}>.{weight.twClass}</code>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LineHeights() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Line Heights</h2>
      <ul className="grid justify-start gap-4">
        {lineHeights.map((lineHeight) => (
          <li key={lineHeight.name}>
            <Card className="grid gap-6">
              <CardHeader className="grid gap-4">
                <p className={cn('text-xs max-w-xs', lineHeight.twClass)}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit.
                </p>
              </CardHeader>
              <CardFooter className="grid gap-2 justify-start">
                <code className={'text-sm font-mono'}>
                  {lineHeight.variable}
                </code>
                <code className={'text-sm font-mono'}>
                  .{lineHeight.twClass}
                </code>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FontSizes() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Font Sizes</h2>
      <ul className="grid gap-4">
        {sizes.map((size) => (
          <li key={size.name}>
            <Card className="grid gap-6">
              <CardHeader className="grid gap-4">
                <p
                  className={cn('text-xs')}
                  style={{ fontSize: size.variable }}
                >
                  Aa
                </p>
              </CardHeader>
              <CardFooter className="grid gap-2 justify-start">
                <code className={'text-sm font-mono'}>{size.variable}</code>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Voices() {
  const [computedValues, setComputedValues] = React.useState<
    Record<string, ReturnType<typeof getFontValues>>
  >({})
  const [isMobile, setIsMobile] = React.useState(false)
  const elementRefs = React.useRef<Record<string, HTMLParagraphElement | null>>(
    {}
  )

  // Update getFontValues to use the actual element
  const getFontValues = (className: string) => {
    if (typeof window === 'undefined') return null

    const element = elementRefs.current[className]
    if (!element) return null

    const computedStyle = window.getComputedStyle(element)
    const fontSize = parseFloat(computedStyle.fontSize)
    const lineHeight = parseFloat(computedStyle.lineHeight)

    return {
      fontFamily: computedStyle.fontFamily.split(',')[0],
      fontSize: computedStyle.fontSize,
      lineHeight: `${Math.round((lineHeight / fontSize) * 100)}%`,
      fontWeight: computedStyle.fontWeight
    }
  }

  React.useEffect(() => {
    // Handle viewport changes and compute font values
    const computeValues = () => {
      setIsMobile(window.innerWidth < 768)

      // Compute font values for each voice class using the actual elements
      const values: Record<string, ReturnType<typeof getFontValues>> = {}
      voiceClasses.forEach((voice) => {
        values[voice] = getFontValues(voice)
      })
      setComputedValues(values)
    }

    // Add a small delay to ensure elements are rendered
    const timeoutId = setTimeout(computeValues, 0)
    window.addEventListener('resize', computeValues)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', computeValues)
    }
  }, [])

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        Voices {isMobile ? 'mobile' : 'desktop'}
      </h2>
      <ul className="grid gap-4">
        {voiceClasses.map((voice, index) => (
          <li key={voice + index}>
            <Card className="grid gap-2">
              <CardContent className="basis-1/3">
                <p
                  ref={(el) => (elementRefs.current[voice] = el)}
                  className={voice}
                >
                  {isMobile ? 'Mobile' : 'Desktop'} Voice{' '}
                  <span className="text-primary">
                    {voice.split('-')[1].toUpperCase()}
                  </span>
                </p>
              </CardContent>
              {computedValues[voice] && (
                <CardFooter className="bg-base-900 flex flex-wrap gap-2 justify-start items-center">
                  <p className="text-xs">
                    Font Family:{' '}
                    <span className="inline-block font-bold pr-2">
                      {computedValues[voice]?.fontFamily}
                    </span>
                    |
                  </p>
                  <p className="text-xs">
                    Font Size:{' '}
                    <span className="inline-block font-bold pr-2">
                      {computedValues[voice]?.fontSize}
                    </span>
                    |
                  </p>
                  <p className="text-xs">
                    Line Height:{' '}
                    <span className="inline-block font-bold pr-2">
                      {computedValues[voice]?.lineHeight}
                    </span>
                    |
                  </p>
                  <p className="text-xs">
                    Font Weight:{' '}
                    <span className="inline-block font-bold pr-2">
                      {computedValues[voice]?.fontWeight}
                    </span>
                    |
                  </p>
                  <code className="text-sm font-mono">.{voice}</code>
                </CardFooter>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TypographyGuide() {
  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold mb-8">Typography Guide</h1>
      <div className="grid gap-12 grid-cols-2 lg:grid-cols-12">
        <div className="col-span-full">
          <FontFamilies />
        </div>
        <div className="col-span-full lg:col-span-6">
          <Voices />
        </div>
        <div className="lg:col-span-2">
          <FontWeights />
        </div>
        <div className="lg:col-span-2">
          <FontSizes />
        </div>
        <div className="lg:col-span-2">
          <LineHeights />
        </div>
      </div>
    </div>
  )
}
