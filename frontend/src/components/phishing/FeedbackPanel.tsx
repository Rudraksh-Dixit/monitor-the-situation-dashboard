// ©AngelaMos | 2026
// FeedbackPanel.tsx

import { useStore } from '@/stores/phishingStore'
import { EmailData, RedFlag } from '@/stores/phishingStore'

interface FeedbackPanelProps {
  isVisible: boolean
  onRestart: () => void
}

export function FeedbackPanel({ isVisible, onRestart }: FeedbackPanelProps) {
  const getRedFlagClass = (type: string) => {
    switch (type) {
      case 'typosquatting_domain':
        return 'bg-red-500/20 text-red-400'
      case 'urgency_tactic':
        return 'bg-orange-500/20 text-orange-400'
      case 'suspicious_link':
        return 'bg-purple-500/20 text-purple-400'
      case 'unexpected_attachment':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const { score, selections, emails, currentIndex } = useStore()

  if (!isVisible) return null

  const currentEmail = emails[currentIndex]
  if (!currentEmail) return null

  const actualFlagIds = currentEmail.redFlags.map((rf) => rf.id)
  const clickedSet = new Set(selections)
  const hasWrongClicks = [...clickedSet].some((id) => !actualFlagIds.has(id))
  const clickedOnlyActual = [...clickedSet].every((id) => actualFlagIds.has(id))
  const missedFlags = actualFlagIds.size > 0 && !([...clickedSet].some((id) => actualFlagIds.has(id))).length > 0

  let correct = 0
  let incorrect = 0
  let missed = 0
  let wrong = 0

  if (hasWrongClicks) {
    incorrect = 1 // penalty for wrong clicks
    wrong = 1
  } else if (clickedSet.size === 0 && currentEmail.redFlags.length > 0) {
    missed = 1
  } else if (clickedOnlyActual && currentEmail.redFlags.length > 0) {
    correct = 1
  }

  // Also compute overall score
  const totalCorrect = score.correct
  const totalIncorrect = score.incorrect
  const totalMissed = score.missed
  const totalWrong = score.wrong

  const percentage = totalCorrect / (totalCorrect + totalIncorrect + totalMissed + totalWrong) * 100

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold text-gray-200 mb-4">
          Round Results
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400">Correct</p>
            <p className="text-3xl font-bold text-green-400">{totalCorrect}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Wrong</p>
            <p className="text-3xl font-bold text-red-400">{totalWrong}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400">This email was</p>
          <p className="text-lg font-medium {currentEmail.isPhishing ? 'text-red-400' : 'text-green-400'}">
            {currentEmail.isPhishing ? 'PHISHING' : 'SAFE'}
          </p>
        </div>

        {currentEmail.isPhishing && (
          <div className="mt-4 text-sm text-gray-300">
            <p>{currentEmail.explanation}</p>
          </div>
        )}

        {currentEmail.redFlags.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400">Red flags in this email:</p>
            {currentEmail.redFlags.map((rf) => (
              <div
                key={rf.id}
                className={getRedFlagClass(rf.type)}
              >
                <span className="font-medium">{rf.type.replace(/_/g, ' ')}</span>
                {rf.hint}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}