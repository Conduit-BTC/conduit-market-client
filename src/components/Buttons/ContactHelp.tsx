import React from 'react'
import Button from './Button'

const ContactHelp: React.FC = () => {
  const onClick = () => {
    console.log('help section')
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="notice-voice text-2xl font-medium">Need help?</h2>
      <Button
        variant="outline"
        size="lg"
        className="border-primary"
        rounded={false}
      >
        Contact support
      </Button>
    </div>
  )
}

export default ContactHelp
