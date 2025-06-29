import React, { useState } from 'react'
import { useSats } from '@/hooks/useSats'
import { formatPrice } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from './Cards/CardComponents'
import Button from './Buttons/Button'

const SatsConverterDemo: React.FC = () => {
  const { convertToSats, isLoading, error, lastUpdated } = useSats()
  const [usdAmount, setUsdAmount] = useState('10.00')

  const handleConvert = () => {
    const amount = parseFloat(usdAmount)
    if (isNaN(amount)) return

    const sats = convertToSats('USD', amount)
    return sats
  }

  const convertedSats = handleConvert()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bitcoin Price Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="usd-amount" className="text-sm font-medium">
            USD Amount
          </label>
          <input
            id="usd-amount"
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            className="w-full p-2 border rounded"
            step="0.01"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Converted to Satoshis:</p>
          <div className="p-3 bg-muted rounded">
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : error ? (
              <p className="text-destructive">Error: {error}</p>
            ) : (
              <p className="text-lg font-bold">
                {convertedSats
                  ? formatPrice(convertedSats, 'SAT')
                  : 'Enter an amount'}
              </p>
            )}
          </div>
        </div>

        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Example conversions:</p>
          <div className="space-y-1 text-sm">
            <p>
              $1.00 ={' '}
              {convertToSats('USD', 1)
                ? formatPrice(convertToSats('USD', 1), 'SAT')
                : '...'}
            </p>
            <p>
              $5.00 ={' '}
              {convertToSats('USD', 5)
                ? formatPrice(convertToSats('USD', 5), 'SAT')
                : '...'}
            </p>
            <p>
              $10.00 ={' '}
              {convertToSats('USD', 10)
                ? formatPrice(convertToSats('USD', 10), 'SAT')
                : '...'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SatsConverterDemo
