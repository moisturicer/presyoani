/**
 * Audit Screen - Digital Notebook
 * View locally stored harvest records
 * Replaces paper logs - data protected in phone memory
 */

import { CropCard } from '@presyoani/ui'

export function AuditScreen() {
  // Placeholder - will use useLocalLedger
  const harvests = [
    { id: '1', crop: 'Tomato', grade: 'A' as const, quantity: '50 kg', price: '₱2,500' },
    { id: '2', crop: 'Rice', grade: 'B' as const, quantity: '100 kg', price: '₱4,200' },
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900">Audit</h2>
      <p className="mt-1 text-sm text-gray-600">
        Your harvest records (saved locally)
      </p>

      <div className="mt-4 space-y-3">
        {harvests.map((h) => (
          <CropCard
            key={h.id}
            cropName={h.crop}
            grade={h.grade}
            quantity={h.quantity}
            price={h.price}
          />
        ))}
      </div>
    </div>
  )
}
