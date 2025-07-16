//todo use better form library

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../Buttons/Button'
import Field from '../Form/Field'
import { useLocation } from 'wouter'
import { useZapoutStore } from '@/stores/useZapoutStore'

// Form configuration object
const formConfig = {
  sections: [
    {
      id: 'name',
      layout: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          placeholder: 'First Name',
          required: true,
          validation: z.string().min(1, 'First name is required')
        },
        {
          name: 'lastName',
          type: 'text',
          placeholder: 'Last Name',
          required: true,
          validation: z.string().min(1, 'Last name is required')
        }
      ]
    },
    {
      id: 'phone',
      layout: 'single',
      fields: [
        {
          name: 'phone',
          type: 'text',
          placeholder: 'Phone (optional)',
          required: false,
          validation: z.string().optional()
        }
      ]
    },
    {
      id: 'address1',
      layout: 'single',
      fields: [
        {
          name: 'street1',
          type: 'text',
          placeholder: 'Street Address',
          required: true,
          validation: z.string().min(1, 'Street address is required')
        }
      ]
    },
    {
      id: 'address2',
      layout: 'single',
      fields: [
        {
          name: 'street2',
          type: 'text',
          placeholder: 'Apt, Suite, etc. (optional)',
          required: false,
          validation: z.string().optional()
        }
      ]
    },
    {
      id: 'location',
      layout: 'row',
      fields: [
        {
          name: 'zip',
          type: 'text',
          placeholder: 'Postal Code',
          required: true,
          validation: z.string().min(1, 'Postal code is required')
        },
        {
          name: 'city',
          type: 'text',
          placeholder: 'City',
          required: true,
          validation: z.string().min(1, 'City is required')
        },
        {
          name: 'region',
          type: 'text',
          placeholder: 'Region',
          required: true,
          validation: z.string().min(1, 'Region is required')
        }
      ]
    },
    {
      id: 'country',
      layout: 'single',
      fields: [
        {
          name: 'country',
          type: 'dropdown',
          placeholder: 'Select Country',
          required: true,
          options: [
            'United States',
            'Canada',
            'United Kingdom',
            'Australia',
            'New Zealand',
            'Other'
          ],
          validation: z.string().min(1, 'Country is required')
        }
      ]
    }
  ]
}

// Generate Zod schema from form configuration
const generateSchema = () => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  formConfig.sections.forEach((section) => {
    section.fields.forEach((field) => {
      schemaFields[field.name] = field.validation
    })
  })

  return z.object(schemaFields)
}

// Zod schema for shipping form validation
export const ShippingFormSchema = generateSchema()

// Infer the type from the schema
export type ShippingFormData = z.infer<typeof ShippingFormSchema>

// Dynamic field renderer component
const DynamicField: React.FC<{
  field: any
  control: any
  errors: any
  className?: string
}> = ({ field, control, errors, className }) => {
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: fieldProps }) => (
        <Field
          {...fieldProps}
          type={field.type}
          placeholder={field.placeholder}
          options={field.options}
          required={field.required}
          error={errors[field.name]?.message}
          className={className}
        />
      )}
    />
  )
}

const ShippingForm: React.FC = () => {
  const [location, navigate] = useLocation()
  const { setShippingInfo } = useZapoutStore()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ShippingFormData>({
    resolver: zodResolver(ShippingFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      street1: '',
      street2: '',
      zip: '',
      city: '',
      region: '',
      country: ''
    }
  })

  const onSubmit = async (data: ShippingFormData) => {
    try {
      // TODO: Data sanitization and validation
      setShippingInfo(data)
      navigate(`?zapoutStep=payment`)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form className="grid gap-2 mt-8" onSubmit={handleSubmit(onSubmit)}>
      {formConfig.sections.map((section) => (
        <div key={section.id} className="space-y-4 mb-6">
          {section.layout === 'row' ? (
            <div className="flex gap-4 sm:flex-row flex-col">
              {section.fields.map((field) => (
                <DynamicField
                  key={field.name}
                  field={field}
                  control={control}
                  errors={errors}
                  className="flex-1"
                />
              ))}
            </div>
          ) : (
            <>
              {section.fields.map((field) => (
                <DynamicField
                  key={field.name}
                  field={field}
                  control={control}
                  errors={errors}
                />
              ))}
            </>
          )}
        </div>
      ))}

      <Button rounded={false} disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Continue to Payment'}
      </Button>
    </form>
  )
}

export default ShippingForm
