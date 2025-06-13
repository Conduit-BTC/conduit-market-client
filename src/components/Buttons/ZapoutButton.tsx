import React from 'react'
import Button from './Button'
import type { ButtonProps } from './Button'
import Icon from '../Icon'

export interface ZapoutButtonProps extends Omit<ButtonProps, 'isLink' | 'to'> {
  merchantPubkey: string
}

const ZapoutButton: React.FC<ZapoutButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children = 'Zapout',
  rounded = true,
  merchantPubkey,

  ...props
}) => {
  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      disabled={disabled}
      isLink={true}
      to={`/zapout/${merchantPubkey}`}
      rounded={rounded}
    >
      <picture>
        <Icon icon="zap" />
      </picture>

      {children}
    </Button>
  )
}

export default ZapoutButton
