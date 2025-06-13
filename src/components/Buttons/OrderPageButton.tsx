import React from 'react'
import { Link } from 'wouter'
import Icon from '../Icon'
import { OrderEventType, useOrderStore } from '@/stores/useOrderStore'
import { useOrderSubscription } from '@/hooks/useOrderSubscription'
import Button from './Button'

interface OrderPageButtonProps {
  className?: string
}

const OrderPageButton: React.FC<OrderPageButtonProps> = ({
  className = ''
}) => {
  const { getUnreadCount } = useOrderStore()
  // Use the subscription hook directly
  useOrderSubscription()

  // Calculate total unread count across all order types
  const getTotalUnreadCount = () => {
    return Object.values(OrderEventType).reduce((total, type) => {
      return total + getUnreadCount(type)
    }, 0)
  }

  const unreadCount = getTotalUnreadCount()

  return (
    <Link
      to="/orders"
      className={`relative inline-flex items-center justify-center ${className}`}
      aria-label={`Orders - ${unreadCount} unread`}
    >
      <Button>
        <Icon icon="receiptText" className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        Orders
      </Button>
    </Link>
  )
}

export default OrderPageButton
