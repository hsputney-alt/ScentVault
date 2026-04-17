import Header from './components/Header'
import SearchBar from './components/SearchBar'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="px-8 py-32 max-w-4xl mx-auto text-center">
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
      </section>
    </main>
  )
}