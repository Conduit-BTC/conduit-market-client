# useSats Hook

The `useSats` hook provides real-time Bitcoin exchange rate conversion from USD to Satoshis using the Strike API.

## Features

- **Real-time conversion**: Fetches current Bitcoin price from Strike API
- **Intelligent caching**: Caches exchange rate for 10 seconds to avoid excessive API calls
- **Automatic updates**: Refreshes rate every 10 seconds in the background
- **Error handling**: Provides error states and loading states
- **TypeScript support**: Fully typed with TypeScript interfaces

## Usage

```tsx
import { useSats } from '@/hooks/useSats'

function MyComponent() {
  const { convertToSats, isLoading, error, lastUpdated } = useSats()

  // Convert USD to sats
  const sats = convertToSats('USD', 10.5) // Returns number of sats

  return (
    <div>
      {isLoading && <p>Loading exchange rate...</p>}
      {error && <p>Error: {error}</p>}
      {sats && <p>10.50 USD = {sats} sats</p>}
    </div>
  )
}
```

## API

### Return Values

- `convertToSats(currency: string, value: number): number`

  - Converts the given currency amount to satoshis
  - Currently only supports 'USD' currency
  - Returns the number of satoshis (integer)

- `isLoading: boolean`

  - `true` when fetching the exchange rate
  - `false` when rate is available or error occurred

- `error: string | null`

  - Error message if API call failed
  - `null` when no error

- `lastUpdated: number | null`
  - Timestamp of when the rate was last updated
  - `null` if no rate has been fetched yet

## Integration with formatPrice

The hook integrates with the `formatPrice` utility function:

```tsx
import { formatPrice } from '@/lib/utils'
import { useSats } from '@/hooks/useSats'

function PriceDisplay() {
  const { convertToSats } = useSats()

  // This will automatically convert USD to sats and format as "S 1,234"
  const formattedPrice = formatPrice(10.5, 'USD', convertToSats)

  return <span>{formattedPrice}</span>
}
```

## Caching Strategy

- Exchange rate is cached for 10 seconds
- Multiple components using the hook share the same cached rate
- Background polling updates the rate every 10 seconds
- If a fetch is already in progress, subsequent calls wait for the same promise

## Error Handling

The hook gracefully handles API errors:

- Network failures
- Invalid API responses
- Rate limiting
- CORS issues

When errors occur, the hook will:

- Set the `error` state with a descriptive message
- Continue to use the last known good rate if available
- Retry on the next 10-second interval

## Example Components

See `SatsConverterDemo.tsx` for a complete example of how to use the hook in a component.
