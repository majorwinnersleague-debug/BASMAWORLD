'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

/* ─── Types ───────────────────────────────────────────── */
interface Note {
  id: number
  lane: number
  y: number
  hit: boolean
  missed: boolean
  spawnTime: number
}

interface HitEffect {
  id: number
  lane: number
  quality: 'perfect' | 'great' | 'good'
  time: number
}

/* ─── Songs ───────────────────────────────────────────── */
const SONGS = [
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    artist: 'BASMA Beats',
    bpm: 120,
    difficulty: 'Easy',
    diffColor: 'text-emerald-400',
    duration: 45,
    pattern: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.25, 3.5, 4.0, 4.5, 5.0, 5.25, 5.5, 6.0, 6.5, 7.0, 7.25, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.25, 10.5, 10.75, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.25, 14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.25, 17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.25, 20.5, 21.0, 21.5, 22.0, 22.25, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 25.25, 25.5, 26.0, 26.5, 27.0, 27.5, 28.0, 28.25, 28.5, 29.0, 29.5, 30.0, 30.25, 30.5, 31.0, 31.5, 32.0, 32.5, 33.0, 33.25, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.25, 36.5, 37.0, 37.5, 38.0, 38.25, 38.5, 39.0, 39.5, 40.0, 40.5, 41.0, 41.5, 42.0, 42.25, 42.5, 43.0, 43.5, 44.0, 44.5],
  },
  {
    id: 'midnight-vibes',
    name: 'Midnight Vibes',
    artist: 'MWL Studio',
    bpm: 140,
    difficulty: 'Medium',
    diffColor: 'text-[#c9a84c]',
    duration: 40,
    pattern: [0.4, 0.8, 1.0, 1.4, 1.8, 2.0, 2.2, 2.6, 3.0, 3.2, 3.4, 3.8, 4.0, 4.2, 4.4, 4.8, 5.0, 5.2, 5.6, 6.0, 6.2, 6.4, 6.6, 7.0, 7.2, 7.4, 7.8, 8.0, 8.2, 8.4, 8.8, 9.0, 9.2, 9.4, 9.8, 10.0, 10.2, 10.6, 11.0, 11.2, 11.4, 11.8, 12.0, 12.2, 12.4, 12.8, 13.0, 13.4, 13.8, 14.0, 14.2, 14.6, 15.0, 15.2, 15.4, 15.8, 16.0, 16.4, 16.8, 17.0, 17.2, 17.4, 17.8, 18.0, 18.4, 18.8, 19.0, 19.2, 19.6, 20.0, 20.2, 20.4, 20.8, 21.0, 21.4, 21.8, 22.0, 22.2, 22.4, 22.8, 23.0, 23.2, 23.6, 24.0, 24.4, 24.8, 25.0, 25.2, 25.4, 25.8, 26.0, 26.4, 26.8, 27.0, 27.4, 27.8, 28.0, 28.4, 28.8, 29.0, 29.4, 29.8, 30.0, 30.2, 30.6, 31.0, 31.4, 31.8, 32.0, 32.4, 32.8, 33.0, 33.4, 33.8, 34.0, 34.4, 34.8, 35.0, 35.4, 35.8, 36.0, 36.4, 36.8, 37.0, 37.4, 37.8, 38.0, 38.4, 38.8, 39.0, 39.4],
  },
  {
    id: 'neon-rush',
    name: 'Neon Rush',
    artist: 'MajorWinners',
    bpm: 160,
    difficulty: 'Hard',
    diffColor: 'text-rose-400',
    duration: 35,
    pattern: [0.3, 0.6, 0.9, 1.0, 1.3, 1.5, 1.6, 1.9, 2.0, 2.15, 2.3, 2.5, 2.8, 3.0, 3.15, 3.3, 3.5, 3.6, 3.9, 4.0, 4.15, 4.3, 4.5, 4.6, 4.9, 5.0, 5.15, 5.3, 5.5, 5.65, 5.8, 6.0, 6.15, 6.3, 6.5, 6.65, 6.8, 7.0, 7.15, 7.3, 7.5, 7.65, 7.8, 8.0, 8.3, 8.5, 8.65, 8.8, 9.0, 9.15, 9.3, 9.5, 9.65, 9.8, 10.0, 10.15, 10.3, 10.5, 10.8, 11.0, 11.15, 11.3, 11.5, 11.8, 12.0, 12.15, 12.3, 12.5, 12.65, 12.8, 13.0, 13.3, 13.5, 13.65, 13.8, 14.0, 14.15, 14.3, 14.5, 14.8, 15.0, 15.15, 15.3, 15.5, 15.8, 16.0, 16.3, 16.5, 16.65, 16.8, 17.0, 17.15, 17.3, 17.5, 17.8, 18.0, 18.3, 18.5, 18.65, 18.8, 19.0, 19.3, 19.5, 19.65, 19.8, 20.0, 20.3, 20.5, 20.8, 21.0, 21.3, 21.5, 21.8, 22.0, 22.3, 22.5, 22.8, 23.0, 23.15, 23.3, 23.5, 23.8, 24.0, 24.3, 24.5, 24.8, 25.0, 25.15, 25.3, 25.5, 25.8, 26.0, 26.3, 26.5, 26.8, 27.0, 27.3, 27.5, 27.8, 28.0, 28.3, 28.5, 28.8, 29.0, 29.3, 29.5, 29.8, 30.0, 30.3, 30.5, 30.8, 31.0, 31.3, 31.5, 31.8, 32.0, 32.3, 32.5, 32.8, 33.0, 33.3, 33.5, 33.8, 34.0, 34.3, 34.5],
  },
]

const LANE_KEYS = ['D', 'F', 'J', 'K']
const LANE_COLORS = [
  { bg: 'bg-[#9b7dff]', glow: 'rgba(155,125,255,0.4)', border: 'border-[#9b7dff]' },
  { bg: 'bg-[#c9a84c]', glow: 'rgba(201,168,76,0.4)', border: 'border-[#c9a84c]' },
  { bg: 'bg-emerald-400', glow: 'rgba(52,211,153,0.4)', border: 'border-emerald-400' },
  { bg: 'bg-rose-400', glow: 'rgba(244,63,94,0.4)', border: 'border-rose-400' },
]

const LANE_WIDTH = 72
const GAME_HEIGHT = 520
const HIT_ZONE_Y = GAME_HEIGHT - 60
const NOTE_SPEED = 280 // px per second
const PERFECT_WINDOW = 30
const GREAT_WINDOW = 55
const GOOD_WINDOW = 85

export default function RhythmGame() {
  const [screen, setScreen] = useState<'select' | 'playing' | 'results'>('select')
  const [selectedSong, setSelectedSong] = useState(SONGS[0])
  const [notes, setNotes] = useState<Note[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [perfect, setPerfect] = useState(0)
  const [great, setGreat] = useState(0)
  const [good, setGood] = useState(0)
  const [missed, setMissed] = useState(0)
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([])
  const [lanePressed, setLanePressed] = useState<boolean[]>([false, false, false, false])
  const [progress, setProgress] = useState(0)

  const gameRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const notesRef = useRef<Note[]>([])
  const comboRef = useRef(0)
  const scoreRef = useRef(0)
  const effectIdRef = useRef(0)
  const spawnedRef = useRef(0)
  const activeRef = useRef(false)

  /* ─── Start Game ────────────────────────────────────── */
  const startGame = useCallback(() => {
    const song = selectedSong
    setScreen('playing')
    setNotes([])
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setPerfect(0)
    setGreat(0)
    setGood(0)
    setMissed(0)
    setHitEffects([])
    setProgress(0)
    notesRef.current = []
    comboRef.current = 0
    scoreRef.current = 0
    spawnedRef.current = 0
    activeRef.current = true

    // Pre-generate all notes from pattern
    const allNotes: Note[] = song.pattern.map((time, i) => ({
      id: i,
      lane: Math.floor(Math.random() * 4),
      y: -40,
      hit: false,
      missed: false,
      spawnTime: time,
    }))

    startTimeRef.current = performance.now()

    const gameLoop = (now: number) => {
      if (!activeRef.current) return

      const elapsed = (now - startTimeRef.current) / 1000

      // Spawn notes based on time
      while (spawnedRef.current < allNotes.length) {
        const note = allNotes[spawnedRef.current]
        const timeUntilHit = note.spawnTime - elapsed
        const noteY = HIT_ZONE_Y - timeUntilHit * NOTE_SPEED
        if (noteY > -60) {
          notesRef.current.push({ ...note })
          spawnedRef.current++
        } else {
          break
        }
      }

      // Update positions
      for (const note of notesRef.current) {
        if (note.hit || note.missed) continue
        const timeUntilHit = note.spawnTime - elapsed
        note.y = HIT_ZONE_Y - timeUntilHit * NOTE_SPEED

        // Miss detection
        if (note.y > HIT_ZONE_Y + GOOD_WINDOW + 20) {
          note.missed = true
          comboRef.current = 0
          setCombo(0)
          setMissed(prev => prev + 1)
        }
      }

      // Progress
      setProgress(Math.min(elapsed / song.duration, 1))
      setNotes([...notesRef.current.filter(n => !n.hit && !n.missed && n.y > -60 && n.y < GAME_HEIGHT + 40)])

      // End check
      if (elapsed >= song.duration + 2) {
        activeRef.current = false
        setScreen('results')
        return
      }

      animRef.current = requestAnimationFrame(gameLoop)
    }

    animRef.current = requestAnimationFrame(gameLoop)
  }, [selectedSong])

  /* ─── Hit Detection ─────────────────────────────────── */
  const tryHit = useCallback((lane: number) => {
    const hittable = notesRef.current
      .filter(n => !n.hit && !n.missed && n.lane === lane)
      .sort((a, b) => Math.abs(a.y - HIT_ZONE_Y) - Math.abs(b.y - HIT_ZONE_Y))

    if (hittable.length === 0) return

    const note = hittable[0]
    const dist = Math.abs(note.y - HIT_ZONE_Y)

    let quality: 'perfect' | 'great' | 'good' | null = null
    let points = 0

    if (dist <= PERFECT_WINDOW) {
      quality = 'perfect'
      points = 100
    } else if (dist <= GREAT_WINDOW) {
      quality = 'great'
      points = 60
    } else if (dist <= GOOD_WINDOW) {
      quality = 'good'
      points = 30
    }

    if (quality) {
      note.hit = true
      comboRef.current++
      const multiplier = Math.min(1 + Math.floor(comboRef.current / 10) * 0.5, 4)
      const finalPoints = Math.round(points * multiplier)
      scoreRef.current += finalPoints

      setScore(scoreRef.current)
      setCombo(comboRef.current)
      setMaxCombo(prev => Math.max(prev, comboRef.current))

      if (quality === 'perfect') setPerfect(p => p + 1)
      else if (quality === 'great') setGreat(p => p + 1)
      else setGood(p => p + 1)

      const eid = ++effectIdRef.current
      setHitEffects(prev => [...prev, { id: eid, lane, quality, time: Date.now() }])
      setTimeout(() => setHitEffects(prev => prev.filter(e => e.id !== eid)), 500)
    }
  }, [])

  /* ─── Keyboard Controls ─────────────────────────────── */
  useEffect(() => {
    if (screen !== 'playing') return

    const keyMap: Record<string, number> = { d: 0, f: 1, j: 2, k: 3 }

    const onKeyDown = (e: KeyboardEvent) => {
      const lane = keyMap[e.key.toLowerCase()]
      if (lane !== undefined) {
        setLanePressed(prev => { const next = [...prev]; next[lane] = true; return next })
        tryHit(lane)
      }
      if (e.key === 'Escape') {
        activeRef.current = false
        cancelAnimationFrame(animRef.current)
        setScreen('select')
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const lane = keyMap[e.key.toLowerCase()]
      if (lane !== undefined) {
        setLanePressed(prev => { const next = [...prev]; next[lane] = false; return next })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [screen, tryHit])

  /* ─── Cleanup ───────────────────────────────────────── */
  useEffect(() => {
    return () => {
      activeRef.current = false
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  /* ─── Touch Controls ────────────────────────────────── */
  const handleTouchLane = (lane: number) => {
    setLanePressed(prev => { const next = [...prev]; next[lane] = true; return next })
    tryHit(lane)
    setTimeout(() => setLanePressed(prev => { const next = [...prev]; next[lane] = false; return next }), 100)
  }

  /* ─── Grade Calculation ─────────────────────────────── */
  const getGrade = () => {
    const total = perfect + great + good + missed
    if (total === 0) return { grade: 'S', color: 'text-[#c9a84c]' }
    const accuracy = ((perfect * 100 + great * 60 + good * 30) / (total * 100)) * 100
    if (accuracy >= 95) return { grade: 'S', color: 'text-[#c9a84c]' }
    if (accuracy >= 85) return { grade: 'A', color: 'text-emerald-400' }
    if (accuracy >= 70) return { grade: 'B', color: 'text-[#9b7dff]' }
    if (accuracy >= 50) return { grade: 'C', color: 'text-white/60' }
    return { grade: 'D', color: 'text-rose-400' }
  }

  const xpEarned = Math.round(score / 20)

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <main className="min-h-screen text-white grain flex flex-col items-center">

      {/* ── Back nav ──────────────────────────────────── */}
      <div className="w-full px-8 pt-8 z-20">
        <Link href="/game" className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
          ← Back to Game Hub
        </Link>
      </div>

      {/* ═══ SONG SELECT ═══════════════════════════════ */}
      {screen === 'select' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-2xl w-full animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">Rhythm Drop</span>
          </h1>
          <p className="text-white/40 text-sm text-center mb-10">Use D F J K keys to hit notes as they reach the bar</p>

          <div className="w-full space-y-3 mb-8">
            {SONGS.map(song => (
              <button
                key={song.id}
                onClick={() => setSelectedSong(song)}
                className={`w-full card-premium rounded-2xl p-5 text-left transition-all ${
                  selectedSong.id === song.id ? 'glass-gold !border-[#c9a84c]/40' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">{song.name}</h3>
                    <p className="text-white/30 text-sm">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${song.diffColor}`}>{song.difficulty}</span>
                    <p className="text-white/20 text-xs">{song.bpm} BPM · {song.pattern.length} notes</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button onClick={startGame} className="btn-gold px-10 py-4 rounded-2xl text-lg font-bold pulse-cta">
            🎵 Start Playing
          </button>

          <div className="mt-8 glass rounded-xl px-5 py-3 text-center">
            <p className="text-white/30 text-xs">
              <span className="text-white/50 font-bold">Controls:</span> D F J K to hit notes · ESC to quit · On mobile, tap the lanes
            </p>
          </div>
        </div>
      )}

      {/* ═══ PLAYING ═══════════════════════════════════ */}
      {screen === 'playing' && (
        <div className="flex-1 flex flex-col items-center pt-4 px-4 w-full max-w-lg">

          {/* HUD */}
          <div className="w-full flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-white/30 text-xs">SCORE</p>
              <p className="text-2xl font-bold gradient-gold">{score.toLocaleString()}</p>
            </div>
            <div className="text-center">
              {combo > 2 && (
                <div className="animate-fadeIn">
                  <p className="text-xs text-white/30">COMBO</p>
                  <p className="text-3xl font-black text-[#c9a84c]">{combo}x</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/30 text-xs">{selectedSong.name}</p>
              <p className="text-white/50 text-sm">{selectedSong.difficulty}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/[0.06] rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9b7dff] to-[#c9a84c] transition-all duration-300" style={{ width: `${progress * 100}%` }} />
          </div>

          {/* Game Board */}
          <div
            ref={gameRef}
            className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
            style={{
              width: LANE_WIDTH * 4 + 16,
              height: GAME_HEIGHT,
              background: 'rgba(5,5,5,0.9)',
            }}
          >
            {/* Lane dividers */}
            {[1, 2, 3].map(i => (
              <div key={i} className="absolute top-0 bottom-0 w-px bg-white/[0.04]" style={{ left: LANE_WIDTH * i + 8 }} />
            ))}

            {/* Hit zone line */}
            <div
              className="absolute left-0 right-0 h-[3px]"
              style={{
                top: HIT_ZONE_Y,
                background: 'linear-gradient(90deg, rgba(155,125,255,0.6), rgba(201,168,76,0.6), rgba(52,211,153,0.6), rgba(244,63,94,0.6))',
                boxShadow: '0 0 20px rgba(201,168,76,0.3)',
              }}
            />

            {/* Notes */}
            {notes.map(note => (
              <div
                key={note.id}
                className={`absolute rounded-lg ${LANE_COLORS[note.lane].bg}`}
                style={{
                  left: note.lane * LANE_WIDTH + 12,
                  top: note.y - 15,
                  width: LANE_WIDTH - 8,
                  height: 30,
                  opacity: note.y < 0 ? 0 : 1,
                  boxShadow: `0 0 12px ${LANE_COLORS[note.lane].glow}`,
                  transition: 'opacity 0.1s',
                }}
              />
            ))}

            {/* Hit effects */}
            {hitEffects.map(e => (
              <div
                key={e.id}
                className="absolute text-center pointer-events-none animate-fadeIn"
                style={{
                  left: e.lane * LANE_WIDTH + 8,
                  top: HIT_ZONE_Y - 40,
                  width: LANE_WIDTH,
                }}
              >
                <span className={`text-sm font-black ${
                  e.quality === 'perfect' ? 'text-[#c9a84c]' :
                  e.quality === 'great' ? 'text-[#9b7dff]' : 'text-white/60'
                }`}>
                  {e.quality.toUpperCase()}
                </span>
              </div>
            ))}

            {/* Lane key labels / touch targets */}
            {LANE_KEYS.map((key, i) => (
              <button
                key={key}
                onTouchStart={() => handleTouchLane(i)}
                className={`absolute bottom-2 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-75 ${
                  lanePressed[i]
                    ? `${LANE_COLORS[i].bg} text-white scale-95`
                    : 'bg-white/[0.06] text-white/30 border border-white/10'
                }`}
                style={{
                  left: i * LANE_WIDTH + 10,
                  width: LANE_WIDTH - 4,
                  height: 40,
                  boxShadow: lanePressed[i] ? `0 0 20px ${LANE_COLORS[i].glow}` : 'none',
                }}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Quit button */}
          <button
            onClick={() => { activeRef.current = false; cancelAnimationFrame(animRef.current); setScreen('select') }}
            className="mt-4 text-white/20 hover:text-white/50 text-xs transition"
          >
            Press ESC or tap to quit
          </button>
        </div>
      )}

      {/* ═══ RESULTS ══════════════════════════════════ */}
      {screen === 'results' && (() => {
        const { grade, color } = getGrade()
        return (
          <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md w-full animate-fadeIn">
            <h2 className="text-2xl font-bold text-white/40 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Song Complete
            </h2>
            <h1 className="text-5xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="gradient-gold">{selectedSong.name}</span>
            </h1>
            <p className="text-white/30 text-sm mb-8">{selectedSong.artist}</p>

            {/* Grade */}
            <div className={`text-8xl font-black mb-6 ${color}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {grade}
            </div>

            {/* Stats */}
            <div className="w-full glass-gold rounded-2xl p-6 mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-white/40 text-sm">Final Score</span>
                <span className="font-bold text-xl gradient-gold">{score.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-white/40 text-sm">Max Combo</span>
                <span className="font-bold text-white">{maxCombo}x</span>
              </div>
              <div className="divider my-3" />
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-[#c9a84c] font-bold text-lg">{perfect}</p>
                  <p className="text-[10px] text-white/30">PERFECT</p>
                </div>
                <div>
                  <p className="text-[#9b7dff] font-bold text-lg">{great}</p>
                  <p className="text-[10px] text-white/30">GREAT</p>
                </div>
                <div>
                  <p className="text-white/60 font-bold text-lg">{good}</p>
                  <p className="text-[10px] text-white/30">GOOD</p>
                </div>
                <div>
                  <p className="text-rose-400 font-bold text-lg">{missed}</p>
                  <p className="text-[10px] text-white/30">MISSED</p>
                </div>
              </div>
            </div>

            {/* XP */}
            <div className="glass rounded-xl px-6 py-3 mb-8 text-center">
              <span className="text-[#c9a84c] font-bold text-lg">+{xpEarned} XP earned</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={startGame} className="btn-gold px-8 py-3 rounded-xl font-bold">
                Play Again
              </button>
              <button onClick={() => setScreen('select')} className="btn-outline px-8 py-3 rounded-xl">
                Song Select
              </button>
            </div>
          </div>
        )
      })()}
    </main>
  )
}
