import React from 'react'

export function VoicesGuide() {
  return (
    <div className="space-y-8">
      <h2 className="attention-voice mb-6">Voices</h2>
      <div className="grid gap-6">
        <div className="space-y-2">
          <p className=" booming-voice">
            Booming Voice - Main headlines and hero text
          </p>
        </div>

        <div className="space-y-2">
          <p className=" loud-voice">Loud Voice - Section headers</p>
        </div>

        <div className="space-y-2">
          <p className=" attention-voice">
            Attention Voice - Subsection headers
          </p>
        </div>

        <div className="space-y-2">
          <p className=" firm-voice">Firm Voice - Important content</p>
        </div>

        <div className="space-y-2">
          <p className=" notice-voice">Notice Voice - Emphasized body text</p>
        </div>

        <div className="space-y-2">
          <p className=" calm-voice">Calm Voice - Regular body text</p>
        </div>

        <div className="space-y-2">
          <p className=" whisper-voice">Whisper Voice - Secondary text</p>
        </div>

        <div className="space-y-2">
          <p className=" solid-voice">Solid Voice - Small but important text</p>
        </div>

        <div className="space-y-2">
          <p className=" micro-voice">Micro Voice - Very small text</p>
        </div>
      </div>
    </div>
  )
}
