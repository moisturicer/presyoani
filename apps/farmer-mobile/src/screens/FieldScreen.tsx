/**
 * Field Screen - Main harvest capture
 * Smart Camera (Edge AI): Photo → Crop ID + Grade A/B/C
 * Digital Notebook: Log harvest locally
 */

import { Button } from '@presyoani/ui'
import { CameraOverlay } from '../components/CameraOverlay'
import { useState } from 'react'

export function FieldScreen() {
  const [showCamera, setShowCamera] = useState(false)

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900">Field</h2>
      <p className="mt-1 text-sm text-gray-600">
        Take a photo of your harvest to grade and log it
      </p>

      <Button
        className="mt-6"
        fullWidth
        onClick={() => setShowCamera(true)}
      >
        📷 Capture Harvest
      </Button>

      {showCamera && (
        <CameraOverlay
          onCapture={() => setShowCamera(false)}
          onCancel={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}
