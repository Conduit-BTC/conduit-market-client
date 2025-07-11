import React from 'react'
import Button from '../Buttons/Button'
import Icon from '../Icon'

interface RepeaterProps<T> {
  title: string
  items: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
  addButtonText?: string
  emptyMessage?: string
  className?: string
}

function Repeater<T>({
  title,
  items,
  onAdd,
  onRemove,
  renderItem,
  addButtonText = 'Add Item',
  emptyMessage = 'No items added yet.',
  className = ''
}: RepeaterProps<T>) {
  return (
    <div
      className={`bg-base-900 rounded-lg p-4 border border-base-800 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <label className="voice-sm font-bold text-base-100">{title}</label>
        <Button
          onClick={onAdd}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {addButtonText}
        </Button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-base-400 italic">{emptyMessage}</p>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-base-800 rounded-md border border-base-700 relative"
          >
            {renderItem(item, index)}
            <div className="absolute top-2 right-2" title="Remove item">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemove(index)}
                className="h-6 w-6 p-1"
              >
                <Icon.Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Repeater
