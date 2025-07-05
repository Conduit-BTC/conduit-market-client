import React from 'react'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import Logo from '@/components/Logo'

const LoadingSplash: React.FC = () => {
  const { isAppLoading, loadingMessage } = useInterfaceStore()

  if (!isAppLoading) return null

  return (
    <div className="fixed inset-0 z-9999 grid place-items-center place-content-center bg-gradient-to-b from-primary to-primary-800">
      <Logo
        variant="outline-glow"
        className="w-screen max-w-300 animate-pulse"
      />

      <div className="grid gap-4 text-center relative -top-40">
        <div className="h-1  bg-muted overflow-hidden rounded-full">
          <div className="h-full w-full bg-secondary animate-[loading_1s_ease-in-out_infinite]" />
        </div>
        <p className="voice-2l text-center text-balance text-secondary-foreground">
          {loadingMessage}
        </p>
      </div>
    </div>
  )
}

export default LoadingSplash
