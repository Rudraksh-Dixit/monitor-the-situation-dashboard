// ©AngelaMos | 2026
// FinalSummary.tsx

import { useStore } from '@/stores/phishingStore'

interface FinalSummaryProps {
  isVisible: boolean
  onRestart: () => void
}

export function FinalSummary({ isVisible, onRestart }: FinalSummaryProps) {
  const { score, emails } = useStore()

  if (!isVisible || !emails) return null

  const correct = score.correct
  const incorrect = score.incorrect
  const missed = score.missed
  const wrong = score.wrong
  const total = emails.length
  const phishingCount = emails.filter((e) => e.isPhishing).length
  const safeCount = total - phishingCount

  // Calculate grade
  const totalAttempted = correct + incorrect + missed + wrong
  const percentage = totalAttempted > 0 ? (correct / totalAttempted) * 100 : 0

  let grade: string
  let comparison: string

  if (percentage >= 90) {
    grade = 'A+'
    comparison = 'Better than 95% of test-takers'
  } else if (percentage >= 80) {
    grade = 'A'
    comparison = 'Better than 85% of test-takers'
  } else if (percentage >= 70) {
    grade = 'B'
    comparison = 'Better than 70% of test-takers'
  } else if (percentage >= 60) {
    grade = 'C'
    comparison = 'Better than 50% of test-takers'
  } else if (percentage >= 50) {
    grade = 'D'
    comparison = 'Below average'
  } else {
    grade = 'F'
    comparison = 'Needs improvement'
  }

  return (
    <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-3xl font-bold text-gray-200 mb-2">Game Over</h3>
        <p className="text-lg text-gray-400 mb-4">You caught {correct} / {phishingCount} phishing attempts</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-3xl font-bold">{`${correct}%`}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Grade</p>
            <p className="text-3xl font-bold text-green-400">{grade}</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-6">{comparison}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Play Again
          </button>
          <button
            onClick={onRestart}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}