'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

/* ─── Question Bank ───────────────────────────────────── */
interface Question {
  question: string
  options: string[]
  correct: number
  category: string
}

const ALL_QUESTIONS: Question[] = [
  // Music Theory
  { question: 'How many notes are in a chromatic scale?', options: ['7', '10', '12', '14'], correct: 2, category: 'Theory' },
  { question: 'What does "forte" mean in music?', options: ['Slow', 'Soft', 'Fast', 'Loud'], correct: 3, category: 'Theory' },
  { question: 'Which note is a whole step above C?', options: ['C#', 'D', 'E', 'B'], correct: 1, category: 'Theory' },
  { question: 'What time signature is a waltz typically in?', options: ['2/4', '3/4', '4/4', '6/8'], correct: 1, category: 'Theory' },
  { question: 'What does "pianissimo" (pp) mean?', options: ['Very loud', 'Very soft', 'Medium', 'Gradually louder'], correct: 1, category: 'Theory' },
  { question: 'How many beats does a dotted half note get in 4/4 time?', options: ['2', '2.5', '3', '4'], correct: 2, category: 'Theory' },
  { question: 'What interval is C to G?', options: ['Third', 'Fourth', 'Fifth', 'Sixth'], correct: 2, category: 'Theory' },
  { question: 'Which clef is also called the "treble clef"?', options: ['F clef', 'C clef', 'G clef', 'D clef'], correct: 2, category: 'Theory' },
  { question: 'What is the relative minor of C major?', options: ['D minor', 'E minor', 'A minor', 'G minor'], correct: 2, category: 'Theory' },
  { question: 'A "fermata" symbol tells you to...', options: ['Speed up', 'Get louder', 'Hold the note', 'Repeat'], correct: 2, category: 'Theory' },
  // Music History
  { question: 'Which era did Beethoven primarily compose in?', options: ['Baroque', 'Classical/Romantic', 'Renaissance', 'Modern'], correct: 1, category: 'History' },
  { question: 'The saxophone was invented by which person?', options: ['John Sax', 'Adolphe Sax', 'Charles Sax', 'Albert Sax'], correct: 1, category: 'History' },
  { question: 'Which city is considered the birthplace of jazz?', options: ['Chicago', 'New York', 'New Orleans', 'Memphis'], correct: 2, category: 'History' },
  { question: 'Who composed "The Four Seasons"?', options: ['Bach', 'Mozart', 'Vivaldi', 'Handel'], correct: 2, category: 'History' },
  { question: 'What year did MTV first broadcast?', options: ['1979', '1981', '1983', '1985'], correct: 1, category: 'History' },
  { question: 'Which instrument did Miles Davis play?', options: ['Saxophone', 'Piano', 'Trumpet', 'Guitar'], correct: 2, category: 'History' },
  { question: 'The "British Invasion" in the 1960s was led by which band?', options: ['The Rolling Stones', 'The Beatles', 'The Who', 'Led Zeppelin'], correct: 1, category: 'History' },
  { question: 'Who is known as the "King of Pop"?', options: ['Elvis Presley', 'Prince', 'Michael Jackson', 'Stevie Wonder'], correct: 2, category: 'History' },
  // Instruments
  { question: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '8'], correct: 2, category: 'Instruments' },
  { question: 'Which instrument family does the piano belong to?', options: ['Strings', 'Percussion', 'Keyboard', 'Woodwind'], correct: 1, category: 'Instruments' },
  { question: 'How many keys are on a standard piano?', options: ['64', '76', '88', '92'], correct: 2, category: 'Instruments' },
  { question: 'The ukulele originated from which country?', options: ['Japan', 'Hawaii/Portugal', 'Philippines', 'Brazil'], correct: 1, category: 'Instruments' },
  { question: 'Which instrument has pedals and 47 strings?', options: ['Harpsichord', 'Harp', 'Zither', 'Lyre'], correct: 1, category: 'Instruments' },
  { question: 'A "capo" is used on which instrument?', options: ['Violin', 'Piano', 'Guitar', 'Drums'], correct: 2, category: 'Instruments' },
  // Production
  { question: 'What does "DAW" stand for?', options: ['Digital Audio Workshop', 'Digital Audio Workstation', 'Dynamic Audio Wave', 'Direct Audio Wire'], correct: 1, category: 'Production' },
  { question: 'What does a compressor do to audio?', options: ['Makes it louder', 'Reduces dynamic range', 'Adds reverb', 'Changes pitch'], correct: 1, category: 'Production' },
  { question: 'Which frequency range are bass sounds in?', options: ['20-250 Hz', '250-2000 Hz', '2000-6000 Hz', '6000-20000 Hz'], correct: 0, category: 'Production' },
  { question: 'What is "sidechain compression" commonly used for?', options: ['Vocal tuning', 'Making kick duck the bass', 'Adding delay', 'Stereo widening'], correct: 1, category: 'Production' },
  { question: 'What BPM range is typical for hip-hop?', options: ['60-80', '85-115', '120-140', '150-180'], correct: 1, category: 'Production' },
  { question: 'What does EQ stand for?', options: ['Electronic Quality', 'Equalization', 'Equal Quantization', 'Enhanced Query'], correct: 1, category: 'Production' },
]

const ROUND_SIZE = 10

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function TriviaGame() {
  const [screen, setScreen] = useState<'start' | 'playing' | 'results'>('start')
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [timerActive, setTimerActive] = useState(false)
  const [answered, setAnswered] = useState<{ correct: boolean; category: string }[]>([])

  /* ─── Timer ─────────────────────────────────────────── */
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, timeLeft])

  useEffect(() => {
    if (timerActive && timeLeft === 0 && !showAnswer) {
      // Time's up — auto-miss
      handleAnswer(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timerActive, showAnswer])

  /* ─── Start ─────────────────────────────────────────── */
  const startRound = useCallback(() => {
    const shuffled = shuffleArray(ALL_QUESTIONS).slice(0, ROUND_SIZE)
    setQuestions(shuffled)
    setCurrent(0)
    setSelected(null)
    setShowAnswer(false)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setTimeLeft(15)
    setTimerActive(true)
    setAnswered([])
    setScreen('playing')
  }, [])

  /* ─── Answer ────────────────────────────────────────── */
  const handleAnswer = useCallback((idx: number) => {
    if (showAnswer) return
    const q = questions[current]
    const correct = idx === q.correct
    setSelected(idx)
    setShowAnswer(true)
    setTimerActive(false)

    if (correct) {
      const timeBonus = Math.round(timeLeft * 5)
      const streakBonus = streak * 10
      setScore(prev => prev + 100 + timeBonus + streakBonus)
      setStreak(prev => {
        const next = prev + 1
        setMaxStreak(m => Math.max(m, next))
        return next
      })
    } else {
      setStreak(0)
    }

    setAnswered(prev => [...prev, { correct, category: q.category }])

    // Auto-advance after delay
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setScreen('results')
      } else {
        setCurrent(prev => prev + 1)
        setSelected(null)
        setShowAnswer(false)
        setTimeLeft(15)
        setTimerActive(true)
      }
    }, 1500)
  }, [showAnswer, questions, current, timeLeft, streak])

  const q = questions[current]
  const correctCount = answered.filter(a => a.correct).length
  const xpEarned = Math.round(score / 30)

  return (
    <main className="min-h-screen text-white grain flex flex-col items-center">

      {/* ── Back nav ──────────────────────────────────── */}
      <div className="w-full px-8 pt-8 z-20">
        <Link href="/game" className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
          ← Back to Game Hub
        </Link>
      </div>

      {/* ═══ START SCREEN ═════════════════════════════ */}
      {screen === 'start' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md w-full animate-fadeIn">
          <span className="text-6xl mb-6">🧠</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">Music Trivia</span>
          </h1>
          <p className="text-white/40 text-sm text-center mb-2">Test your knowledge of music theory, history, and production</p>
          <p className="text-white/30 text-xs text-center mb-10">{ROUND_SIZE} questions · 15 seconds each · streak bonuses</p>

          <div className="w-full glass rounded-2xl p-5 mb-8">
            <p className="text-white/30 text-xs mb-3 text-center">Categories</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Theory', 'History', 'Instruments', 'Production'].map(cat => (
                <span key={cat} className="text-xs px-3 py-1 rounded-full bg-white/[0.06] text-white/50 border border-white/10">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <button onClick={startRound} className="btn-gold px-10 py-4 rounded-2xl text-lg font-bold pulse-cta">
            Start Round
          </button>
        </div>
      )}

      {/* ═══ PLAYING ═════════════════════════════════ */}
      {screen === 'playing' && q && (
        <div className="flex-1 flex flex-col items-center pt-8 px-6 max-w-lg w-full">

          {/* HUD */}
          <div className="w-full flex items-center justify-between mb-6">
            <div>
              <p className="text-white/30 text-xs">SCORE</p>
              <p className="text-xl font-bold gradient-gold">{score.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-white/30 text-xs">QUESTION</p>
              <p className="text-white font-bold">{current + 1} / {questions.length}</p>
            </div>
            <div className="text-right">
              {streak > 1 && (
                <div className="animate-fadeIn">
                  <p className="text-white/30 text-xs">STREAK</p>
                  <p className="text-xl font-bold text-[#c9a84c]">{streak} 🔥</p>
                </div>
              )}
            </div>
          </div>

          {/* Timer bar */}
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 linear ${
                timeLeft > 5 ? 'bg-gradient-to-r from-[#9b7dff] to-[#c9a84c]' : 'bg-rose-500'
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>

          {/* Category badge */}
          <span className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1 text-xs text-white/40 mb-4">
            {q.category}
          </span>

          {/* Question */}
          <div className="glass-gold rounded-2xl p-6 w-full mb-6">
            <h2 className="text-xl font-bold text-white text-center leading-relaxed">
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div className="w-full space-y-3">
            {q.options.map((opt, i) => {
              let style = 'card-premium hover:border-white/20'
              if (showAnswer) {
                if (i === q.correct) style = 'bg-emerald-500/20 border border-emerald-500/40'
                else if (i === selected && i !== q.correct) style = 'bg-rose-500/20 border border-rose-500/40'
                else style = 'card-premium opacity-40'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showAnswer}
                  className={`w-full rounded-xl px-5 py-4 text-left transition-all ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      showAnswer && i === q.correct ? 'bg-emerald-500 text-white' :
                      showAnswer && i === selected ? 'bg-rose-500 text-white' :
                      'bg-white/[0.06] text-white/40'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`font-medium ${showAnswer && i !== q.correct && i !== selected ? 'text-white/30' : 'text-white'}`}>
                      {opt}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showAnswer && (
            <div className="mt-4 animate-fadeIn text-center">
              {selected === q.correct ? (
                <p className="text-emerald-400 font-bold">Correct! +{100 + timeLeft * 5 + (streak - 1) * 10}</p>
              ) : (
                <p className="text-rose-400 font-bold">
                  {selected === -1 ? "Time's up!" : 'Wrong!'} Answer: {q.options[q.correct]}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ RESULTS ════════════════════════════════ */}
      {screen === 'results' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md w-full animate-fadeIn">
          <h2 className="text-2xl font-bold text-white/40 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Round Complete
          </h2>
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">Music Trivia</span>
          </h1>

          {/* Score circle */}
          <div className="w-32 h-32 rounded-full glass-gold flex items-center justify-center mb-6">
            <div className="text-center">
              <p className="text-3xl font-black gradient-gold">{correctCount}</p>
              <p className="text-white/30 text-xs">/ {questions.length}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="w-full glass-gold rounded-2xl p-6 mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-white/40 text-sm">Final Score</span>
              <span className="font-bold text-xl gradient-gold">{score.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-white/40 text-sm">Best Streak</span>
              <span className="font-bold text-white">{maxStreak} 🔥</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-sm">Accuracy</span>
              <span className="font-bold text-white">{questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}%</span>
            </div>
            <div className="divider my-3" />
            <p className="text-white/30 text-xs text-center">Category Breakdown</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {['Theory', 'History', 'Instruments', 'Production'].map(cat => {
                const catAnswers = answered.filter(a => a.category === cat)
                const catCorrect = catAnswers.filter(a => a.correct).length
                if (catAnswers.length === 0) return null
                return (
                  <span key={cat} className={`text-xs px-2.5 py-1 rounded-full border ${
                    catCorrect === catAnswers.length ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    catCorrect > 0 ? 'bg-[#c9a84c]/15 text-[#c9a84c] border-[#c9a84c]/30' :
                    'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}>
                    {cat}: {catCorrect}/{catAnswers.length}
                  </span>
                )
              })}
            </div>
          </div>

          {/* XP */}
          <div className="glass rounded-xl px-6 py-3 mb-8 text-center">
            <span className="text-[#c9a84c] font-bold text-lg">+{xpEarned} XP earned</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={startRound} className="btn-gold px-8 py-3 rounded-xl font-bold">
              Play Again
            </button>
            <Link href="/game" className="btn-outline px-8 py-3 rounded-xl inline-flex items-center">
              Game Hub
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
