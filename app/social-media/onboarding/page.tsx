'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

type Step = 'connect' | 'upload' | 'launch'

export default function OnboardingPage() {
  const params = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const tier = params.get('tier') ?? 'growth'

  const [step, setStep] = useState<Step>('connect')
  const [connectUrl, setConnectUrl] = useState<string | null>(null)
  const [loadingConnect, setLoadingConnect] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Fetch Upload-Post connect URL on mount
  useEffect(() => {
    if (!sessionId) return
    setLoadingConnect(true)
    fetch('/api/social-media/connect-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.url) setConnectUrl(d.url)
      })
      .finally(() => setLoadingConnect(false))
  }, [sessionId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(file)
  }

  const handleUpload = async () => {
    if (!uploadedFile) return
    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('video', uploadedFile)
    formData.append('sessionId', sessionId)

    try {
      // Simulate progress for UX
      const interval = setInterval(() => {
        setUploadProgress(p => Math.min(p + 10, 90))
      }, 400)

      const res = await fetch('/api/social-media/upload-video', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      clearInterval(interval)
      setUploadProgress(100)

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl)
        setTimeout(() => setStep('launch'), 600)
      } else {
        alert('Upload failed. Please try again.')
      }
    } catch {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleLaunch = async () => {
    if (!videoUrl) return
    setProcessing(true)
    try {
      await fetch('/api/social-media/process-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, videoUrl }),
      })
    } catch {
      // Fire and forget — webhook handles the rest
    }
    setProcessing(false)
  }

  return (
    <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block bg-[#22C55E]/20 border border-[#22C55E]/30 rounded-full px-4 py-1 text-[#22C55E] text-sm font-medium mb-4">
          Payment confirmed ✓
        </div>
        <h1 className="text-3xl font-bold text-white">Let&apos;s get you set up</h1>
        <p className="text-white/50 mt-2">3 quick steps — then you&apos;re on autopilot.</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-10">
        {(['connect', 'upload', 'launch'] as Step[]).map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full transition-all ${
              step === s ? 'bg-[#8B5CF6]' :
              (['connect', 'upload', 'launch'] as Step[]).indexOf(step) > i ? 'bg-[#22C55E]' : 'bg-white/10'
            }`} />
            <span className={`text-xs ${step === s ? 'text-[#8B5CF6]' : 'text-white/30'}`}>
              {s === 'connect' ? 'Connect Accounts' : s === 'upload' ? 'Upload Video' : 'Launch'}
            </span>
          </div>
        ))}
      </div>

      {/* STEP: Connect */}
      {step === 'connect' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Social Accounts</h2>
            <p className="text-white/50 text-sm mb-6">
              Click below to securely connect the platforms you want us to post to.
              You&apos;ll log in to each one — we never see your passwords.
            </p>

            {loadingConnect ? (
              <div className="shimmer text-white/40 text-sm">Generating your secure link…</div>
            ) : connectUrl ? (
              <a
                href={connectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-8 py-4 rounded-xl transition-all glow-purple"
              >
                Connect My Accounts →
              </a>
            ) : (
              <p className="text-red-400 text-sm">Could not load connection link. Please refresh.</p>
            )}
          </div>

          <button
            onClick={() => setStep('upload')}
            className="w-full py-3 text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            Already connected → Skip to upload
          </button>
        </div>
      )}

      {/* STEP: Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              uploadedFile ? 'border-[#22C55E]/60 bg-[#22C55E]/5' : 'border-white/20 hover:border-[#8B5CF6]/60 bg-white/3'
            }`}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/mov,video/avi,video/quicktime"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadedFile ? (
              <>
                <div className="text-4xl mb-3">🎬</div>
                <p className="text-white font-semibold">{uploadedFile.name}</p>
                <p className="text-white/40 text-sm mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                <p className="text-[#22C55E] text-sm mt-2">Tap to change</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">📤</div>
                <h2 className="text-xl font-bold text-white mb-2">Upload Your Video</h2>
                <p className="text-white/50 text-sm">MP4, MOV, or AVI · Up to 2GB</p>
                <p className="text-white/30 text-xs mt-2">Drag & drop or tap to browse</p>
              </>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/50">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5CF6] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('connect')}
              className="flex-1 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/30 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={handleUpload}
              disabled={!uploadedFile || uploading}
              className="flex-[2] py-4 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading…' : 'Upload Video →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP: Launch */}
      {step === 'launch' && (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-2 float">🚀</div>
          <h2 className="text-3xl font-bold text-white">You&apos;re all set!</h2>
          <p className="text-white/60">
            Your video is queued. We&apos;ll run it through Opus Clip, pick the best moments,
            write platform-specific captions, and post everything automatically.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
            {['Video received ✓', 'Opus Clip processing…', 'AI selecting best clips', 'Writing captions per platform', 'Posting to your accounts'].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-sm w-5 h-5 rounded-full flex items-center justify-center ${i === 0 ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-white/20 bg-white/5'}`}>
                  {i === 0 ? '✓' : '○'}
                </span>
                <span className={`text-sm ${i === 0 ? 'text-white' : 'text-white/30'}`}>{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleLaunch}
            disabled={processing}
            className="w-full py-4 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all glow-purple disabled:opacity-50"
          >
            {processing ? 'Starting automation…' : 'Start Processing My Video →'}
          </button>

          <a
            href="/social-media/dashboard"
            className="block text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            Go to my dashboard →
          </a>
        </div>
      )}
    </main>
  )
}
