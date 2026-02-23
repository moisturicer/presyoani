/**
 * Insight Screen - Fair Price Checker
 * Shows latest city market prices (cached when online)
 * Helps farmers negotiate and avoid underpayment
 */

export function InsightScreen() {
  // Placeholder - will use cached price data
  const prices = [
    { crop: 'Tomato', grade: 'A', price: '₱50/kg', trend: '↑' },
    { crop: 'Rice', grade: 'B', price: '₱42/kg', trend: '→' },
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900">Insight</h2>
      <p className="mt-1 text-sm text-gray-600">
        Current market prices (updated when online)
      </p>

      <div className="mt-4 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        {prices.map((p) => (
          <div
            key={`${p.crop}-${p.grade}`}
            className="flex justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <span className="font-medium">{p.crop}</span>
              <span className="ml-2 text-sm text-gray-500">Grade {p.grade}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-ani-green-600">{p.price}</span>
              <span className="ml-1 text-sm">{p.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
