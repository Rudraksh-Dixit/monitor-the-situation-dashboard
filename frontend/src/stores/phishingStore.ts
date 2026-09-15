// ©AngelaMos | 2026
// phishingStore.ts

import { create } from 'zustand'

export type RedFlag = {
  id: string
  type: 'typosquatting_domain' | 'urgency_tactic' | 'suspicious_link' | 'unexpected_attachment' | 'suspicious_sender'
  location: string
  hint: string
  explanation: string
}

export type EmailData = {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  timestamp: string
  body: string
  redFlags: RedFlag[]
  isPhishing: boolean
  explanation: string
}

export type GameState = {
  currentIndex: number
  score: {
    correct: number
    incorrect: number
    missed: number
    wrong: number
  }
  selections: Set<string>
  answered: boolean
  totalPhishing: number
}

type PhishingStore = GameState & {
  emails: EmailData[]
  loadEmails: () => void
  nextEmail: () => void
  submitAnswer: (clickedFlagIds: string[]) => void
  resetGame: () => void
}

export const useStore = create<PhishingStore>((set, get) => ({
  emails: [],
  currentIndex: 0,
  score: { correct: 0, incorrect: 0, missed: 0, wrong: 0 },
  selections: new Set(),
  answered: false,
  totalPhishing: 0,

  loadEmails: () => {
    // Emails are loaded from the JSON file via the store init
    // The data is made available via the package's data directory
    import('@/data/emails.json').then((mod) => {
      const emails = mod.default || mod
      set({ emails })
      set({ totalPhishing: emails.filter((e: EmailData) => e.isPhishing).length })
    })
  },

  nextEmail: () => {
    const { currentIndex, emails } = get()
    if (currentIndex >= emails.length - 1) {
      // Game over - could navigate to summary
      return
    }
    set({
      currentIndex: currentIndex + 1,
      selections: new Set(),
      answered: false,
    })
  },

  submitAnswer: (clickedFlagIds: string[]) => {
    const { emails, currentIndex, score } = get()
    const email = emails[currentIndex]

    if (!email) return

    const clickedSet = new Set(clickedFlagIds)
    const actualFlagIds = new Set(email.redFlags.map((rf) => rf.id))
    const missedFlagIds = new Set([...actualFlagIds].filter((id) => !clickedSet.has(id)))
    const wrongFlagIds = new Set([...clickedSet].filter((id) => !actualFlagIds.has(id)))

    let newCorrect = score.correct
    let newIncorrect = score.incorrect
    let newMissed = score.missed
    let newWrong = score.wrong

    // Count correct: user clicked some actual red flags (at least one, ideally all)
    // For simplicity: if user clicked at least one actual flag, it's partially correct
    // But we'll count: correct = user clicked all actual flags, wrong = user clicked non-flags
    // Partial: if user clicked some actual flags but missed some

    // Let's do a scoring system:
    // - If user clicked ONLY actual flag IDs: correct++
    // - If user clicked ANY non-flag ID: wrong++ (penalty)
    // - If user clicked nothing but there were flags: missed++
    // - If user clicked only actual flags (some or all): correct++ with bonus

    const hasWrongClicks = [...clickedSet].some((id) => !actualFlagIds.has(id))

    if (hasWrongClicks) {
      newWrong++
    } else if (clickedSet.size === 0 && actualFlagIds.size > 0) {
      // Nothing clicked but there were flags
      newMissed++
    } else if (clickedSet.size > 0 && [...clickedSet].every((id) => actualFlagIds.has(id))) {
      // Only actual flags were clicked (may be some, may be all)
      newCorrect++
    } else if (clickedSet.size > 0 && ![...clickedSet].every((id) => actualFlagIds.has(id))) {
      // Mixed clicks - some flag, some not (handled by hasWrongClicks above)
      newWrong++
    }

    // If it's phishing, also track missed flags
    if (email.isPhishing) {
      const totalActual = actualFlagIds.size
      const clickedActual = [...clickedSet].filter((id) => actualFlagIds.has(id)).length
      if (clickedSet.size > 0 && clickedActual < totalActual) {
        newMissed++
      }
    }

    set({
      score: { ...score, ...{ correct: newCorrect, incorrect: newIncorrect, missed: newMissed, wrong: newWrong } },
      selections: clickedSet,
      answered: true,
    })
  },

  resetGame: () => {
    set({
      currentIndex: 0,
      score: { correct: 0, incorrect: 0, missed: 0, wrong: 0 },
      selections: new Set(),
      answered: false,
    })
  },
}))