'use client';

export default function BillyChatButton() {
  return (
    <button
      onClick={() => {
        const btn = document.querySelector<HTMLButtonElement>('[aria-label="Open Billy Chat"]')
        btn?.click()
      }}
      className="font-bold px-8 py-4 rounded-full text-black transition hover:brightness-110 hover:scale-105 text-lg"
      style={{ background: '#39FF14' }}
    >
      🪆 Chat with Billy Now!
    </button>
  )
}
