import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy } from 'lucide-react'

export const BitcoinQR = ({
  lightningInvoice,
  width = 300
}: {
  lightningInvoice: string
  width?: number
}) => {
  const [copied, setCopied] = useState(false)
  const lightningUri = `lightning:${lightningInvoice}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lightningInvoice)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative w-full max-w-lg mx-auto p-8 rounded-2xl border-2 border-primary-500/60 bg-gradient-to-br from-primary-900/80 to-primary-800/80 shadow-2xl backdrop-blur-md overflow-hidden animate-fade-in">
      {/* Animated border glow */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-primary-500/40 animate-border-glow" />
      {/* QR Code Section */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative group flex items-center justify-center mb-2">
          <div className="absolute inset-0 bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors rounded-xl blur-sm animate-pulse" />
          <QRCodeSVG
            value={lightningUri}
            size={Math.max(width, 240)}
            className="w-full h-auto bg-white p-3 rounded-xl border-4 border-primary-700 shadow-lg"
            level="M"
          />
        </div>
        <div className="relative w-full">
          <div className="font-mono text-base break-all text-primary-100 p-4 bg-primary-900 rounded-xl border border-primary-700 shadow-inner">
            {lightningInvoice}
            <button
              onClick={handleCopy}
              className="absolute bottom-3 right-3 p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
              aria-label="Copy invoice"
            >
              <Copy
                className={`w-5 h-5 ${
                  copied ? 'text-green-400' : 'text-primary-400'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="text-primary-400 w-full text-center mt-4 animate-pulse">
          ⚡ Scan with your Lightning wallet to pay
        </div>
      </div>
    </div>
  )
}

export default BitcoinQR
