//todo use better form library

import Button from '../Buttons/Button'
import Icon from '../Icon'
import Field from '../Form/Field'
import { useLocation } from 'wouter'
import { navigate } from 'wouter/use-browser-location'

const form = [
  [
    {
      label: 'First Name',
      name: 'firstName',
      type: 'text',
      placeholder: 'First Name',
      required: true
    },
    {
      label: 'Last Name',
      name: 'lastName',
      type: 'text',
      placeholder: 'Last Name',
      required: true
    }
  ],
  {
    label: 'Phone',
    name: 'phone',
    type: 'text',
    placeholder: 'Phone (optional)'
  },
  {
    label: 'Address Line 1',
    name: 'addressLine1',
    type: 'text',
    placeholder: 'Street Address',
    required: true
  },
  {
    label: 'Address Line 2',
    name: 'addressLine2',
    type: 'text',
    placeholder: 'Apt, Suite, etc. (optional)'
  },
  [
    {
      label: 'Postal Code',
      name: 'postalCode',
      type: 'text',
      placeholder: 'Postal Code',
      required: true
    },
    {
      label: 'City',
      name: 'city',
      type: 'text',
      placeholder: 'City',
      required: true
    },
    {
      label: 'Region',
      name: 'region',
      type: 'text',
      placeholder: 'Region',
      required: true
    }
  ],
  {
    label: 'Country',
    name: 'country',
    type: 'dropdown',
    placeholder: 'Country',
    required: true,
    options: [
      'United States',
      'Canada',
      'United Kingdom',
      'Australia',
      'New Zealand',
      'Other'
    ],
    multiple: false
  }
]

const ShippingForm: React.FC = () => {
  const [location, navigate] = useLocation()

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate(`?zapoutStep=payment`)
  }

  return (
    <form className="grid gap-2 mt-8" onSubmit={handleSubmit}>
      {form.map((group, index) => (
        <div key={index} className="space-y-4 mb-6">
          {/* Handle grouped fields (arrays) */}
          {Array.isArray(group) ? (
            <div className="flex gap-4 sm:flex-row flex-col">
              {group.map((field, fieldIndex) => (
                <Field
                  key={fieldIndex}
                  //   label={field.label}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  //   required={field.required} #fixme
                  className="flex-1"
                />
              ))}
            </div>
          ) : (
            /* Handle single fields */
            <Field
              //  label={group.label}
              name={group.name}
              type={group.type}
              placeholder={group.placeholder}
              //   required={group.required} #fixme
            />
          )}
        </div>
      ))}

      <Button rounded={false}>Continue to Payment</Button>
    </form>
  )
}

export default ShippingForm
