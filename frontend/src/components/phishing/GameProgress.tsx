// ©AngelaMos | 2026
// GameProgress.tsx

import { useStore } from '@/stores/phishingStore'

interface GameProgressProps {
  showSummary: () => void
}

export function GameProgress({ showSummary }: GameProgressProps) {
  const { currentIndex, score, emails, answered } = useStore()

  if (!emails || emails.length === 0) return null

  const total = emails.length
  const current = currentIndex + 1
  const phishingCount = emails.filter((e) => e.isPhishing).length
  const safeCount = emails.length - phishingCount
  const correct = score.correct
  const incorrect = score.incorrect
  const missed = score.missed
  const wrong = score.wrong

  const percentage = correct / (correct + incorrect + missed + wrong) * 100

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg">
            Email {current} of {total}
          </span>
          <button
            onClick={showSummary}
            className="text-sm text-blue-600 hover:underline"
            disabled={answered === false}
          >
            Show Summary
          </button>
        </div>

        <div className="flex gap-2">
          {emails.map((email, i) => {
            const isCurrent = i === currentIndex
            const isPhishing = email.isPhishing
            const bg = isPhishing ? 'bg-red-500' : 'bg-green-500'
            const text = isPhishing ? 'text-white' : 'text-gray-900'

            return (
              <div
                key={email.id}
                className={`w-2 h-2 rounded ${isCurrent ? bg : 'opacity-30'} ${text} transition-colors duration-200`}
              />
            )
          })}
        </div>

        <div className="mt-4 text-sm">
          <span className="font-medium">Correct:</span> {correct}
          <span className="mx-2">|</span>
          <span className="font-medium">Wrong:</span> {wrong}
          <span className="mx-2">|</span>
          <span className="font-medium">Missed:</span> {missed}
        </div>
      </div>
    </div>
  )
}