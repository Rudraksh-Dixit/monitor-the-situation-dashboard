// ©AngelaMos | 2026
// PhishingEmailView.tsx

import { useStore } from '@/stores/phishingStore'
import { EmailData, RedFlag } from '@/stores/phishingStore'

interface PhishingEmailViewProps {
  email: EmailData
  onNext: () => void
  onSubmit: (clickedIds: string[]) => void
}

export function PhishingEmailView({ email, onNext, onSubmit }: PhishingEmailViewProps) {
  const { selections } = useStore()

  // Handle click on a red flag span
  const handleSpanClick = (flagId: string) => {
    const newSelections = new Set(selections)
    if (newSelections.has(flagId)) {
      newSelections.delete(flagId)
    } else {
      newSelections.add(flagId)
    }
    // Update store state
    useStore.getState().selections = newSelections
  }

  // Check if a clicked ID is an actual red flag
  const isCorrectClick = (flagId: string): boolean =>
    email.redFlags.some((rf) => rf.id === flagId)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header - sender info */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">{email.senderName}</span>
            <span className="text-sm text-gray-500">{email.senderEmail}</span>
          </div>
          <div className="mt-1 text-xs text-gray-400">{email.timestamp}</div>
        </div>

        {/* Subject */}
        <h2 className="mt-3 text-2xl font-bold tracking-tight">{email.subject}</h2>

        {/* Body with interactive red flag spans */}
        <p className="mt-4 text-lg leading-relax">
          {email.body.split(' ').map((word, wordIndex) => {
            // Check if this word contains or matches a red flag location
            const matchingFlags = email.redFlags.filter((rf) =>
              rf.location.split(' ').includes(word) || word.includes(rf.location)
            )

if (matchingFlags.length > 0) {
              // Render as interactive span for each matching flag
              return (
                <React.Fragment key={`rf-${wordIndex}-${matchingFlags[0].id}`}>
                  <span
                    className="relative inline-block cursor-pointer hover:text-red-600"
                    onClick={() => handleSpanClick(matchingFlags[0].id)}
                    data-rf-id={matchingFlags[0].id}
                    style={{
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                      color: selections.has(matchingFlags[0].id) ? 'rgb(239, 68, 68)' : undefined,
                    }}
                  >
                    {word}
                  </span>
                  <span
                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  />
                </React.Fragment>
              )
            }

            return word + ' '
          })}
        </p>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => onSubmit([...selections])}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={selections.size === 0}
          >
            Submit
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            disabled={!email.isPhishing && selections.size > 0}
          >
            {email.isPhishing ? 'Next' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}