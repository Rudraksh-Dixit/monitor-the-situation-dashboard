// ©AngelaMos | 2026
// phishing-training.tsx

import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'

import { useStore } from '@/stores/phishingStore'
import { EmailData } from '@/stores/phishingStore'
import { PhishingEmailView } from '@/components/phishing/PhishingEmailView'
import { FeedbackPanel } from '@/components/phishing/FeedbackPanel'
import { GameProgress } from '@/components/phishing/GameProgress'
import { FinalSummary } from '@/components/phishing/FinalSummary'

import { ROUTES } from '@/config'

export function PhishingTrainingPage(): JSX.Element {
  const navigate = useNavigate()
  const {
    emails,
    currentIndex,
    score,
    selections,
    answered,
    totalPhishing,
    nextEmail,
    submitAnswer,
    resetGame,
    loadEmails,
  } = usePhishingStore()

  // Load emails on mount
  useEffect(() => {
    loadEmails()
  }, [loadEmails])

  // If no emails yet, show placeholder
  if (!emails || emails.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2>Phishing Training</h2>
        <p>Loading emails...</p>
      </div>
    )
  }

  const total = emails.length
  const currentEmail = emails[currentIndex]
  const isLastEmail = currentIndex >= total - 1

  // Handle submit
  const handleSubmit = (clickedIds: string[]) => {
    submitAnswer(clickedIds)

    // Show feedback panel
    setTimeout(() => {
      // Feedback is handled internally via state in the store
      // Move to next email after a brief delay
      if (!isLastEmail) {
        setTimeout(() => {
          nextEmail()
        }, 2000)
      } else {
        setTimeout(() => {
          navigate(ROUTES.HOME)
        }, 2000)
      }
    }, 3000)
  }

  // Handle next (when on last email, go to summary)
  const handleNext = () => {
    if (isLastEmail) {
      navigate(ROUTES.HOME)
    } else {
      nextEmail()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" duration={2500} theme="dark" />

      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Phishing Detection Training</h1>
          <p className="text-gray-500 mt-1">
            Spot the red flags. Score points for correct clicks. Learn to identify phishing.
          </p>
        </header>

        <GameProgress showSummary={() => navigate(ROUTES.HOME)} />

        <PhishingEmailView
          email={currentEmail!}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />

        {answered && currentIndex < total - 1 && (
          <FeedbackPanel
            isVisible={true}
            onRestart={() => {}}
          />
        )}

        {isLastEmail && answered && (
          <FinalSummary
            isVisible={true}
            onRestart={() => {
              resetGame()
              navigate(ROUTES.PHISHING_TRAINING)
            }}
          />
        )}
      </div>
    </div>
  )
}