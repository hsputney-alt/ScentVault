'use client'

import { useState } from 'react'
import FragranceFilters, { FilterState } from '../components/FragranceFilters'
import SearchBar from '../components/SearchBar'

type DiscounterPrice = {
  id: string
  priceUsd: number
  affiliateUrl: string
  discounter: { name: string }
}

type Fragrance = {
  id: string
  name: string
  concentration: string | null
  occasion: string[]
  season: string[]
  gender: string
  retailPriceUsd: number | null
  notes: string[]
  house: { name: string; tier: string }
  discounterPrices: DiscounterPrice[]
}

function applyFilters(fragrances: Fragrance[], filters: FilterState, query: string) {
  return fragrances.filter(f => {
    if (filters.category === 'Designer' && f.house.tier === 'niche') return false
    if (filters.category === 'Niche' && f.house.tier === 'designer') return false
    if (filters.gender !== 'All' && f.gender.toLowerCase() !== filters.gender.toLowerCase()) return false
    if (filters.occasion !== 'All' && !f.occasion.map(o => o.toLowerCase()).includes(filters.occasion.toLowerCase())) return false
    if (filters.season !== 'All' && !f.season.map(s => s.toLowerCase()).includes(filters.season.toLowerCase())) return false
    if (filters.timeOfDay === 'Day' && !f.occasion.some(o => ['office', 'casual', 'sport'].includes(o.toLowerCase()))) return false
    if (filters.timeOfDay === 'Night' && !f.occasion.some(o => ['date', 'evening'].includes(o.toLowerCase()))) return false
    if (filters.concentration !== 'All' && f.concentration !== filters.concentration) return false
    if (query) {
      const q = query.toLowerCase()
      const matches =
        f.name.toLowerCase().includes(q) ||
        f.house.name.toLowerCase().includes(q) ||
        f.occasion.some(o => o.toLowerCase().includes(q)) ||
        f.season.some(s => s.toLowerCase().includes(q)) ||
        f.notes.some(n => n.toLowerCase().includes(q))
      if (!matches) return false
    }
    return true
  })
}

export default function WishlistClient({ fragrances: initialFragrances }: { fragrances: Fragrance[] }) {
  const [fragrances, setFragrances] = useState(initialFragrances)
  const [filters, setFilters] = useState<FilterState>({
    category: 'All', gender: 'All', occasion: 'All', timeOfDay: 'All', season: 'All', concentration: 'All',
  })
  const [query, setQuery] = useState('')
  const [removing, setRemoving] = useState<string | null>(null)
  const [moving, setMoving] = useState<string | null>(null)

  async function handleRemove(fragranceId: string) {
    setRemoving(fragranceId)
    await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fragranceId }),
    })
    setFragrances(prev => prev.filter(f => f.id !== fragranceId))
    setRemoving(null)
  }

  async function handleMoveToCollection(fragranceId: string) {
    setMoving(fragranceId)
    await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fragranceId }),
    })
    await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fragranceId }),
    })
    setFragrances(prev => prev.filter(f => f.id !== fragranceId))
    setMoving(null)
  }

  const filtered = applyFilters(fragrances, filters, query)

  if (fragrances.length === 0) {
    return (
      <div style={{padding: '64px 32px', maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
        <div style={{fontFamily: 'Georgia, serif', fontSize: '24px', color: '#0f172a', marginBottom: '12px'}}>Your wishlist is empty</div>
        <p style={{color: '#94a3b8', fontSize: '14px', marginBottom: '24px'}}>Browse fragrances on the Discover page and add them to your wishlist.</p>
        <a href="/discover" style={{background: '#1e3a5f', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px'}}>
          Browse fragrances
        </a>
      </div>
    )
  }

  return (
    <div style={{padding: '32px', maxWidth: '1000px', margin: '0 auto'}}>
      <div style={{marginBottom: '24px'}}>
        <h1 style={{fontFamily: 'Georgia, serif', fontSize: '30px', color: '#0f172a', marginBottom: '8px', fontWeight: 400}}>Wishlist</h1>
        <p style={{color: '#94a3b8', fontSize: '14px'}}>Fragrances you want — with the best current prices.</p>
      </div>

      <div style={{marginBottom: '24px'}}>
        <SearchBar onSearch={setQuery} />
      </div>

      <FragranceFilters onChange={setFilters} />

      <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '16px'}}>
        {filtered.length} fragrance{filtered.length !== 1 ? 's' : ''}
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
        {filtered.map((fragrance) => {
          const sortedPrices = [...fragrance.discounterPrices].sort((a, b) => a.priceUsd - b.priceUsd)
          const lowestPrice = sortedPrices[0]
          const savings = lowestPrice ? (fragrance.retailPriceUsd ?? 0) - lowestPrice.priceUsd : 0

          return (
            <div key={fragrance.id} style={{border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', background: 'white'}}>
              <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px'}}>
                <div>
                  <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '2px'}}>
                    {fragrance.house.name}
                  </div>
                  <div style={{fontFamily: 'Georgia, serif', fontSize: '20px', color: '#0f172a'}}>
                    {fragrance.name}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(fragrance.id)}
                  disabled={removing === fragrance.id}
                  style={{fontSize: '18px', color: '#e2e8f0', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '4px'}}
                  title="Remove from wishlist"
                >
                  ×
                </button>
              </div>

              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '12px'}}>
                  <span style={{fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through'}}>${(fragrance.retailPriceUsd ?? 0).toFixed(0)}</span>
                  {lowestPrice && (
                    <span style={{fontSize: '18px', fontWeight: 600, color: '#1d4ed8'}}>${lowestPrice.priceUsd.toFixed(0)}</span>
                  )}
                  {savings > 0 && (
                    <span style={{fontSize: '12px', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontWeight: 500}}>
                      Save ${Math.round(savings)}
                    </span>
                  )}
                </div>

                <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                  {sortedPrices.map(price => (
                    
<a                       key={price.id}
                      href={price.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '999px', textDecoration: 'none', whiteSpace: 'nowrap'}}
                    >
                      {price.discounter.name}
                    </a>
                  ))}
                  <button
                    onClick={() => handleMoveToCollection(fragrance.id)}
                    disabled={moving === fragrance.id}
                    style={{fontSize: '12px', background: '#1e3a5f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '999px', cursor: 'pointer', whiteSpace: 'nowrap'}}
                  >
                    {moving === fragrance.id ? 'Moving...' : 'Move to collection'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && fragrances.length > 0 && (
        <div style={{textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px'}}>
          No fragrances match your search.
        </div>
      )}
    </div>
  )
}