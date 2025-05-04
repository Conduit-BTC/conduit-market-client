import React from 'react'

export function VoicesGuide() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="booming-voice">The quick brown fox</div>
          <p className="text-muted-foreground booming-voice">
            Booming Voice - Main headlines and hero text (--text-4xl)
          </p>
        </div>

        <div className="space-y-2">
          <div className="loud-voice">The quick brown fox</div>
          <p className="text-muted-foreground loud-voice">
            Loud Voice - Section headers (--text-3xl)
          </p>
        </div>

        <div className="space-y-2">
          <div className="attention-voice">The quick brown fox</div>
          <p className="text-muted-foreground attention-voice">
            Attention Voice - Subsection headers (--text-2xl)
          </p>
        </div>

        <div className="space-y-2">
          <div className="firm-voice">The quick brown fox</div>
          <p className="text-muted-foreground firm-voice">
            Firm Voice - Important content (--text-xl)
          </p>
        </div>

        <div className="space-y-2">
          <div className="notice-voice">The quick brown fox</div>
          <p className="text-muted-foreground notice-voice">
            Notice Voice - Emphasized body text (--text-lg)
          </p>
        </div>

        <div className="space-y-2">
          <div className="calm-voice">The quick brown fox</div>
          <p className="text-muted-foreground calm-voice">
            Calm Voice - Regular body text (--text-base)
          </p>
        </div>

        <div className="space-y-2">
          <div className="whisper-voice">The quick brown fox</div>
          <p className="text-muted-foreground whisper-voice">
            Whisper Voice - Secondary text (--text-sm)
          </p>
        </div>

        <div className="space-y-2">
          <div className="solid-voice">The quick brown fox</div>
          <p className="text-muted-foreground solid-voice">
            Solid Voice - Small but important text (--text-sm, bold)
          </p>
        </div>

        <div className="space-y-2">
          <div className="micro-voice">The quick brown fox</div>
          <p className="text-muted-foreground micro-voice">
            Micro Voice - Very small text (--text-xs)
          </p>
        </div>
      </div>
    </div>
  )
}
