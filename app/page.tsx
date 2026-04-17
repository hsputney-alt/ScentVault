import Link from 'next/link'
import Header from './components/Header'
import SearchBar from './components/SearchBar'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="px-8 py-32 max-w-4xl mx-auto text-center">
        <div className="inline-block text-xs font-medium tracking-widest uppercase text-blue-400 border border-blue-100 bg-blue-50 px-3 py-1 rounded-full mb-6">
          For fragrance enthusiasts
        </div>
        <h1 className="font-serif text-6xl font-normal text-slate-900 leading-tight mb-6">
          Your fragrance collection,{' '}
          <span className="italic text-blue-400">perfected</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Track what you own, discover what you'll love, and always find the best price from trusted discounters.
        </p>
        <div style={{marginBottom: '48px'}}>
          <SearchBar redirectToDiscover centered />
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/collection" className="bg-blue-900 text-white px-8 py-3 rounded-lg text-sm hover:bg-blue-800 transition-colors">
            Start your collection
          </Link>
          <Link href="/discover" className="border border-slate-200 text-slate-600 px-8 py-3 rounded-lg text-sm hover:border-slate-300 transition-colors">
            Browse fragrances
          </Link>
        </div>
      </section>
    </main>
  )
}