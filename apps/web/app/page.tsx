import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').select('count')
  const connected = !error

  const items: [string, boolean][] = [
    ['GitHub Repo',                  true],
    ['Monorepo Structure',           true],
    ['Supabase — 14 tables',         true],
    ['Row Level Security',           true],
    ['Storage Buckets',              true],
    ['Next.js App',                  true],
    ['Supabase Connected',           connected],
    ['Claude Design → Next.js Pages',false],
    ['Authentication (Login/Signup)',false],
    ['Deploy to Vercel',             false],
    ['React Native Mobile App',      false],
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#1a4b8c]">
          One Stop Immigration Station
        </h1>
        <p className="text-gray-500 mt-1">Full Stack Rebuild — Development Mode</p>
      </div>

      {/* Connection status */}
      <div className={`rounded-xl border-2 p-6 text-center min-w-72 ${
        connected
          ? 'bg-green-50 border-green-400'
          : 'bg-red-50 border-red-400'
      }`}>
        <div className="text-4xl mb-2">{connected ? '✅' : '❌'}</div>
        <h2 className={`text-lg font-semibold ${connected ? 'text-green-700' : 'text-red-700'}`}>
          Supabase {connected ? 'Connected!' : 'Not Connected'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {connected ? 'Database is ready.' : error?.message}
        </p>
      </div>

      {/* Progress checklist */}
      <div className="bg-white rounded-xl shadow p-6 min-w-72">
        <h3 className="font-semibold text-[#1a4b8c] mb-4">Build Progress</h3>
        {items.map(([label, done]) => (
          <div key={label} className={`flex items-center gap-3 py-2 border-b border-gray-50 text-sm ${done ? 'text-gray-800' : 'text-gray-400'}`}>
            <span>{done ? '✅' : '⬜'}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
