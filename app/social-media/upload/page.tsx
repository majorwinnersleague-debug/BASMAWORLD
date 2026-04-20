'use client'

import { useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const PLATFORMS = [
  { id: 'TikTok', icon: '🎵', label: 'TikTok' },
  { id: 'Instagram Reels', icon: '📸', label: 'Instagram' },
  { id: 'YouTube Shorts', icon: '▶️', label: 'YouTube' },
  { id: 'Facebook', icon: '📘', label: 'Facebook' },
  { id: 'LinkedIn', icon: '💼', label: 'LinkedIn' },
]

type UploadState = 'idle' | 'uploading' | 'processing' | 'posting' | 'done' | 'error'
type UploadMode = 'full' | 'preclipped'

export default function UploadPage() {
  const params = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const clientId = params.get('client_id') ?? ''

  const [files, setFiles] = useState<File[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [state, setState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [mode, setMode] = useState<UploadMode>('preclipped')
  const [postResults, setPostResults] = useState<{ posted: number; total: number }>({ posted: 0, total: 0 })
  const fileRef = useRef<HTMLInputElement>(null)

  const identifier = clientId || sessionId

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('video/')
    )
    if (mode === 'full') {
      // Full video mode: only one file
      if (droppedFiles[0]) setFiles([droppedFiles[0]])
    } else {
      // Pre-clipped mode: allow multiple
      setFiles(prev => [...prev, ...droppedFiles])
    }
  }, [mode])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (mode === 'full') {
      if (selected[0]) setFiles([selected[0]])
    } else {
      setFiles(prev => [...prev, ...selected])
    }
    // Reset input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // ── Full video flow (original — sends to Opus Clip) ──────────────────────
  const handleFullVideoUpload = async () => {
    if (!files[0] || !identifier) return
    setState('uploading')
    setProgress(0)
    setError('')

    try {
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 8, 85))
      }, 500)

      const formData = new FormData()
      formData.append('video', files[0])
      formData.append('sessionId', identifier)

      const uploadRes = await fetch('/api/social-media/upload-video', {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadRes.json()
      clearInterval(progressInterval)

      if (!uploadRes.ok || !uploadData.videoUrl) {
        throw new Error(uploadData.error ?? 'Upload failed')
      }

      setProgress(90)
      setState('processing')

      const processRes = await fetch('/api/social-media/process-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: identifier,
          videoUrl: uploadData.videoUrl,
        }),
      })

      const processData = await processRes.json()
      setProgress(100)

      if (processData.status === 'processing' || processData.projectId) {
        setState('done')
      } else {
        throw new Error(processData.error ?? 'Processing failed')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      setState('error')
    }
  }

  // ── Pre-clipped flow (NEW — skips Opus, posts directly) ──────────────────
  const handlePreClippedUpload = async () => {
    if (files.length === 0 || !identifier) return
    setState('uploading')
    setProgress(0)
    setError('')

    try {
      // Step 1: Upload all clips to Vercel Blob
      const uploadedClips: Array<{ url: string; filename: string }> = []
      const totalFiles = files.length

      for (let i = 0; i < totalFiles; i++) {
        setProgress(Math.round(((i + 0.5) / totalFiles) * 60))

        const formData = new FormData()
        formData.append('video', files[i])
        formData.append('sessionId', identifier)

        const uploadRes = await fetch('/api/social-media/upload-video', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()

        if (!uploadRes.ok || !uploadData.videoUrl) {
          throw new Error(uploadData.error ?? `Upload failed for ${files[i].name}`)
        }

        uploadedClips.push({
          url: uploadData.videoUrl,
          filename: files[i].name,
        })
      }

      setProgress(70)
      setState('posting')

      // Step 2: Send all clips to process-video with directPost flag
      const processRes = await fetch('/api/social-media/process-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: identifier,
          directPost: true,
          clips: uploadedClips,
        }),
      })

      const processData = await processRes.json()
      setProgress(100)

      if (processData.success || processData.clipsPosted > 0) {
        setPostResults({
          posted: processData.clipsPosted ?? 0,
          total: processData.totalAttempted ?? 0,
        })
        setState('done')
      } else {
        throw new Error(processData.error ?? 'Posting failed')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      setState('error')
    }
  }

  const handleUpload = () => {
    if (mode === 'full') {
      handleFullVideoUpload()
    } else {
      handlePreClippedUpload()
    }
  }

  const resetUpload = () => {
    setFiles([])
    setState('idle')
    setProgress(0)
    setError('')
    setPostResults({ posted: 0, total: 0 })
  }

  // No identifier — show auth gate
  if (!identifier) {
    return (
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-3">Access Required</h1>
        <p className="text-white/50 mb-6">
          You need a valid session to upload videos. If you&apos;re a subscriber,
          use the link from your welcome email.
        </p>
        <Link
          href="/social-media"
          className="inline-block bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-6 py-3 rounded-xl transition-all"
        >
          Get Started →
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Upload Video</h1>
          <p className="text-white/50 mt-1">
            {mode === 'full'
              ? 'Upload a full video and we\'ll create clips automatically.'
              : 'Upload pre-clipped videos to post directly to your socials.'}
          </p>
        </div>
        <Link
          href={`/social-media/dashboard?session_id=${identifier}`}
          className="text-[#8B5CF6] hover:text-[#c084fc] text-sm font-medium transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Mode toggle */}
      {state === 'idle' && (
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => { setMode('preclipped'); setFiles([]) }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === 'preclipped'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            ✂️ Pre-Clipped Videos
          </button>
          <button
            onClick={() => { setMode('full'); setFiles([]) }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === 'full'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            🎬 Full Video → AI Clips
          </button>
        </div>
      )}

      {/* Upload done state */}
      {state === 'done' && (
        <div className="text-center py-12 space-y-6">
          <div className="text-6xl mb-2 animate-[float_4s_ease-in-out_infinite]">🚀</div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'preclipped' ? 'Clips Posted!' : 'Video Submitted!'}
          </h2>

          {mode === 'preclipped' ? (
            <>
              <p className="text-white/60 max-w-md mx-auto">
                {postResults.posted > 0
                  ? `Successfully posted ${postResults.posted} clip${postResults.posted !== 1 ? 's' : ''} to your social accounts! 🎉`
                  : 'Your clips were uploaded but posting is pending — check your dashboard for status.'}
              </p>

              {/* Direct post results */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left max-w-sm mx-auto space-y-3">
                {[
                  { label: `${files.length} clip${files.length !== 1 ? 's' : ''} uploaded to cloud`, done: true },
                  { label: 'AI captions generated per platform', done: true },
                  { label: `${postResults.posted} post${postResults.posted !== 1 ? 's' : ''} sent to your accounts`, done: true },
                  { label: 'Airtable updated', done: true },
                  { label: 'Email notification sent', done: postResults.posted > 0 },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`text-sm w-5 h-5 rounded-full flex items-center justify-center ${
                      step.done ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-white/20 bg-white/5'
                    }`}>
                      {step.done ? '✓' : '○'}
                    </span>
                    <span className={`text-sm ${step.done ? 'text-white' : 'text-white/30'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-white/60 max-w-md mx-auto">
                Your video is being processed by Opus Clip. We&apos;ll pick the best clips,
                write platform-specific captions, and post everything automatically.
                You&apos;ll get an email when it&apos;s done.
              </p>

              {/* Opus pipeline status */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left max-w-sm mx-auto space-y-3">
                {[
                  { label: 'Video uploaded', done: true },
                  { label: 'Sent to Opus Clip', done: true },
                  { label: 'Selecting best clips', done: false },
                  { label: 'Writing captions per platform', done: false },
                  { label: 'Auto-posting to your accounts', done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`text-sm w-5 h-5 rounded-full flex items-center justify-center ${
                      step.done ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-white/20 bg-white/5'
                    }`}>
                      {step.done ? '✓' : '○'}
                    </span>
                    <span className={`text-sm ${step.done ? 'text-white' : 'text-white/30'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex gap-3 justify-center pt-4">
            <button
              onClick={resetUpload}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              Upload More
            </button>
            <Link
              href={`/social-media/dashboard?session_id=${identifier}`}
              className="bg-white/5 border border-white/10 hover:border-white/30 text-white/70 font-medium px-6 py-3 rounded-xl transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Upload form */}
      {state !== 'done' && (
        <div className="space-y-8">
          {/* Drop zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 scale-[1.02]'
                : files.length > 0
                ? 'border-[#22C55E]/60 bg-[#22C55E]/5'
                : 'border-white/20 hover:border-[#8B5CF6]/60 bg-white/[0.03]'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/mov,video/avi,video/quicktime"
              multiple={mode === 'preclipped'}
              className="hidden"
              onChange={handleFileSelect}
              disabled={state === 'uploading' || state === 'processing' || state === 'posting'}
            />
            {files.length > 0 ? (
              <>
                <div className="text-4xl mb-3">
                  {mode === 'preclipped' ? '✂️' : '🎬'}
                </div>
                <p className="text-white font-semibold text-lg">
                  {files.length} {files.length === 1 ? 'clip' : 'clips'} selected
                </p>
                <p className="text-white/40 text-sm mt-1">
                  {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB total
                </p>
                <p className="text-[#22C55E] text-sm mt-3">
                  {mode === 'preclipped' ? 'Click to add more clips' : 'Click to change file'}
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">
                  {mode === 'preclipped' ? '✂️' : '📤'}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {mode === 'preclipped'
                    ? 'Drop your pre-clipped videos here'
                    : 'Drag & drop your video here'}
                </h2>
                <p className="text-white/50 text-sm">
                  MP4, MOV, or AVI · Up to 500 MB
                  {mode === 'preclipped' && ' · Multiple files OK'}
                </p>
                <p className="text-white/30 text-xs mt-2">
                  or click to browse your files
                </p>
              </>
            )}
          </div>

          {/* File list (pre-clipped mode) */}
          {mode === 'preclipped' && files.length > 0 && (
            <div className="space-y-2">
              <label className="block text-white font-semibold text-sm mb-2">
                Clips to post ({files.length})
              </label>
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg">🎬</span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{f.name}</p>
                      <p className="text-white/30 text-xs">{(f.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                    className="text-white/30 hover:text-red-400 text-sm transition-colors ml-3 flex-shrink-0"
                    disabled={state !== 'idle'}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Platform selection */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Post to these platforms
              <span className="text-white/30 font-normal text-sm ml-2">
                (optional — uses your connected accounts by default)
              </span>
            </label>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selectedPlatforms.includes(p.id)
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {(state === 'uploading' || state === 'processing' || state === 'posting') && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">
                  {state === 'uploading'
                    ? `Uploading ${files.length} clip${files.length !== 1 ? 's' : ''}…`
                    : state === 'posting'
                    ? 'Generating captions & posting to socials…'
                    : 'Submitting to Opus Clip…'}
                </span>
                <span className="text-[#8B5CF6] font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error state */}
          {state === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
              <button
                onClick={resetUpload}
                className="text-red-300 text-sm mt-2 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || state === 'uploading' || state === 'processing' || state === 'posting'}
            className="w-full py-4 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all disabled:opacity-30 disabled:cursor-not-allowed glow-purple text-lg"
          >
            {state === 'uploading'
              ? 'Uploading…'
              : state === 'processing'
              ? 'Processing…'
              : state === 'posting'
              ? 'Posting to socials…'
              : mode === 'preclipped'
              ? `Post ${files.length || ''} Clip${files.length !== 1 ? 's' : ''} to Socials →`
              : 'Upload & Create Clips →'}
          </button>

          {/* Info callout */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">
              {mode === 'preclipped' ? 'How direct posting works:' : 'How it works:'}
            </h3>
            <div className="space-y-2.5">
              {mode === 'preclipped' ? (
                <>
                  {[
                    { icon: '✂️', text: 'Clip your video in Opus Clip (or any editor)' },
                    { icon: '📤', text: 'Upload your clips here (drag & drop multiple)' },
                    { icon: '✍️', text: 'AI writes platform-specific captions for each clip' },
                    { icon: '🚀', text: 'Clips are posted directly to all your connected accounts' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-lg">{step.icon}</span>
                      <span className="text-white/60 text-sm">{step.text}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { icon: '📤', text: 'Upload your video (any length)' },
                    { icon: '✂️', text: 'Opus Clip AI picks the best moments & creates short clips' },
                    { icon: '✍️', text: 'AI writes platform-specific captions with trending hashtags' },
                    { icon: '🚀', text: 'Clips are auto-posted to all your connected social accounts' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-lg">{step.icon}</span>
                      <span className="text-white/60 text-sm">{step.text}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
