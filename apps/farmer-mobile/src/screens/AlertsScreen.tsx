/**
 * Alerts Screen - Notifications
 * SMS alerts when buyers are interested
 * Sync status when data is sent/received
 */

export function AlertsScreen() {
  // Placeholder - will integrate with Twilio SMS
  const alerts: { id: string; message: string; time: string }[] = []

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900">Alerts</h2>
      <p className="mt-1 text-sm text-gray-600">
        Buyer interest and sync notifications
      </p>

      <div className="mt-6">
        {alerts.length === 0 ? (
          <p className="text-center text-gray-500">No alerts yet</p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <p className="text-sm">{a.message}</p>
                <p className="mt-1 text-xs text-gray-500">{a.time}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
