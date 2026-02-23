/**
 * Mobile-specific bottom navigation
 * Links to: Field, Audit, Insight, Alerts
 */

export function BottomNav() {
  const navItems = [
    { id: 'field', label: 'Field', icon: '🌾' },
    { id: 'audit', label: 'Audit', icon: '📋' },
    { id: 'insight', label: 'Insight', icon: '📊' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-gray-200 bg-white py-2 safe-area-pb">
      {navItems.map((item) => (
        <button
          key={item.id}
          className="flex flex-col items-center gap-1 px-4 py-2 text-ani-green-600"
          aria-label={item.label}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
