export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[#8B5CF6] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🎵</div>
      </div>
      <div className="text-center">
        <p className="text-white/60 text-sm font-medium">Loading BasmaWorld</p>
        <p className="text-white/20 text-xs mt-1">Las Vegas · Music · Community</p>
      </div>
    </div>
  )
}
