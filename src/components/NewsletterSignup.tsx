import React from 'react'
import Field from './Form/Field'
import Button from './Buttons/Button'

const NewsletterSignup: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup logic here
  }

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <h2 className="voice-lg text-2xl font-medium">Join our newsletter</h2>
        <p className="voice-base text-base-200">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
        <Field
          name="email"
          type="email"
          placeholder="Enter your email"
          className="flex-1"
        />
        <Button
          variant="outline"
          size="lg"
          className="border-primary"
          rounded={false}
        >
          Submit
        </Button>
      </form>

      <p className="voice-xs">
        By subscribing you agree to with our{' '}
        <Button variant="link" to="/privacy" isLink className="inline p-0">
          Privacy Policy
        </Button>
      </p>
    </div>
  )
}

export default NewsletterSignup
