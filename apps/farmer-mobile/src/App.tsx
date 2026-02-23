import { BottomNav } from './components/BottomNav'
import { useOfflineStatus } from './hooks/useOfflineStatus'

function App() {
  const isOnline = useOfflineStatus()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-800">
          You're offline. Data will sync when connected.
        </div>
      )}

      {/* Screen content placeholder - routes go here */}
      <main className="p-4">
        <h1 className="text-xl font-bold text-gray-900">PresyoAni</h1>
        <p className="mt-2 text-gray-600">Offline-first harvest assistant</p>
      </main>

      <BottomNav />
    </div>
  )
}

export default App
