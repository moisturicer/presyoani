/**
 * Camera overlay for harvest photo capture
 * Used in Field screen for Smart Camera (Edge AI) crop grading
 */

interface CameraOverlayProps {
  onCapture?: () => void
  onCancel?: () => void
}

export function CameraOverlay({ onCapture, onCancel }: CameraOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      {/* Camera viewport placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="aspect-square w-full max-w-sm rounded-lg border-2 border-dashed border-white/30 bg-gray-800/50">
          <p className="flex h-full items-center justify-center text-white/60">
            Camera view
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-around gap-4 p-6">
        <button
          onClick={onCancel}
          className="rounded-full bg-white/20 px-6 py-3 text-white"
        >
          Cancel
        </button>
        <button
          onClick={onCapture}
          className="rounded-full bg-ani-green-600 px-8 py-3 text-white"
        >
          Capture
        </button>
      </div>
    </div>
  )
}
