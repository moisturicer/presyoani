import type { HTMLAttributes } from 'react'

export interface CropCardProps extends HTMLAttributes<HTMLDivElement> {
  cropName: string
  grade?: 'A' | 'B' | 'C'
  quantity?: string
  price?: string
}

/**
 * Crop info card - used for harvest display
 */
export function CropCard({
  cropName,
  grade,
  quantity,
  price,
  className = '',
  ...props
}: CropCardProps) {
  const gradeColors = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-yellow-100 text-yellow-800',
    C: 'bg-orange-100 text-orange-800',
  }

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900">{cropName}</h3>
        {grade && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${gradeColors[grade]}`}>
            Grade {grade}
          </span>
        )}
      </div>
      {(quantity || price) && (
        <div className="mt-2 flex gap-4 text-sm text-gray-600">
          {quantity && <span>{quantity}</span>}
          {price && <span className="font-medium text-ani-green-600">{price}</span>}
        </div>
      )}
    </div>
  )
}
