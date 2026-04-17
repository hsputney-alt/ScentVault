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

export default function WishlistClient({ fragrances }: { fragrances: Fragrance[] }) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All', gender: 'All', occasion: 'All', timeOfDay: 'All', season: 'All', concentration: 'All',
  })
  const [query, setQuery] = useState('')
  const filtered = applyFilters(fragrances, filters, query)

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

      <div style={{border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <th style={{textAlign: 'left', fontSize: '11px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 20px'}}>Fragrance</th>
              <th style={{textAlign: 'right', fontSize: '11px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 20px', width: '100px'}}>Retail</th>
              <th style={{textAlign: 'right', fontSize: '11px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 20px', width: '100px'}}>Best price</th>
              <th style={{textAlign: 'right', fontSize: '11px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 20px', width: '100px'}}>Savings</th>
              <th style={{textAlign: 'right', fontSize: '11px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 20px', width: '220px'}}>Buy</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((fragrance, index) => {
              const sortedPrices = [...fragrance.discounterPrices].sort((a, b) => a.priceUsd - b.priceUsd)
              const lowestPrice = sortedPrices[0]
              const savings = lowestPrice ? (fragrance.retailPriceUsd ?? 0) - lowestPrice.priceUsd : 0
              const isLast = index === filtered.length - 1

              return (
                <tr key={fragrance.id} style={{borderBottom: isLast ? 'none' : '1px solid #f8fafc', background: 'white'}}>
                  <td style={{padding: '16px 20px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#bfdbfe', flexShrink: 0}} />
                      <div>
                        <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '2px'}}>
                          {fragrance.house.name}
                        </div>
                        <div style={{fontFamily: 'Georgia, serif', fontSize: '17px', color: '#0f172a'}}>
                          {fragrance.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding: '16px 20px', textAlign: 'right'}}>
                    <span style={{fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through'}}>
                      ${(fragrance.retailPriceUsd ?? 0).toFixed(0)}
                    </span>
                  </td>
                  <td style={{padding: '16px 20px', textAlign: 'right'}}>
                    {lowestPrice ? (
                      <span style={{fontSize: '14px', fontWeight: 600, color: '#1d4ed8'}}>
                        ${lowestPrice.priceUsd.toFixed(0)}
                      </span>
                    ) : (
                      <span style={{fontSize: '14px', color: '#cbd5e1'}}>—</span>
                    )}
                  </td>
                  <td style={{padding: '16px 20px', textAlign: 'right'}}>
                    {savings > 0 ? (
                      <span style={{fontSize: '14px', fontWeight: 600, color: '#16a34a'}}>
                        ${Math.round(savings)}
                      </span>
                    ) : (
                      <span style={{fontSize: '14px', color: '#cbd5e1'}}>—</span>
                    )}
                  </td>
                  <td style={{padding: '16px 20px'}}>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                      {sortedPrices.map((price) => (
                        
<a                           key={price.id}
                          href={price.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '999px', textDecoration: 'none', whiteSpace: 'nowrap'}}
                        >
                          {price.discounter.name}
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div style={{textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px'}}>
          No fragrances match your search.
        </div>
      )}
    </div>
  )
}