import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artist Intake — In Vegas Entertainment',
  description: 'Submit your artist profile to In Vegas Entertainment. Hip-Hop, Opera, Country, Pop, R&B welcome.',
}

export default function IVEArtistIntake() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🎤</div>
            <h1 className="text-4xl font-bold text-purple-400 mb-3">Artist Intake</h1>
            <p className="text-gray-300 text-lg mb-2">
              In Vegas Entertainment — Artist Submission
            </p>
            <p className="text-purple-400 font-semibold">Hip-Hop · Opera · Country · Pop · R&amp;B</p>
            <p className="text-gray-500 text-sm mt-2">Las Vegas, Nevada · Music &amp; Entertainment</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-purple-800 shadow-lg shadow-purple-900/20">
            <iframe
              src="https://airtable.com/embed/app3lrz9FiS3uBQr8/pag0FW171AaOpljet"
              style={{ background: 'transparent', border: '1px solid #ccc' }}
              width="100%"
              height="800"
              title="IVE Artist Intake Form"
            />
          </div>

          <p className="text-center text-gray-600 text-sm mt-6">
            Questions? Email us at{' '}
            <a href="mailto:InVegasEntertainment@gmail.com" className="text-purple-400 hover:underline">
              InVegasEntertainment@gmail.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
