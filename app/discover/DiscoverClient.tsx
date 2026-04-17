'use client'

import { useState } from 'react'
import FragranceFilters, { FilterState } from '../components/FragranceFilters'

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
  description: string | null
  retailPriceUsd: number | null
  house: { name: string; tier: string }
  discounterPrices: DiscounterPrice[]
}

function applyFilters(fragrances: Fragrance[], filters: FilterState) {
  return fragrances.filter(f => {
    if (filters.category === 'Designer' && f.house.tier === 'niche') return false
    if (filters.category === 'Niche' && f.house.tier === 'designer') return false
    if (filters.gender !== 'All' && f.gender.toLowerCase() !== filters.gender.toLowerCase()) return false
    if (filters.occasion !== 'All' && !f.occasion.map(o => o.toLowerCase()).includes(filters.occasion.toLowerCase())) return false
    if (filters.season !== 'All' && !f.season.map(s => s.toLowerCase()).includes(filters.season.toLowerCase())) return false
    if (filters.timeOfDay === 'Day' && !f.occasion.some(o => ['office', 'casual', 'sport'].includes(o.toLowerCase()))) return false
    if (filters.timeOfDay === 'Night' && !f.occasion.some(o => ['date', 'evening'].includes(o.toLowerCase()))) return false
    return true
  })
}

export default function DiscoverClient({ fragrances }: { fragrances: Fragrance[] }) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All', gender: 'All', occasion: 'All', timeOfDay: 'All', season: 'All',
  })

  const filtered = applyFilters(fragrances, filters)

  return (
    <div style={{padding: '32px', maxWidth: '1100px', margin: '0 auto'}}>
      <div style={{marginBottom: '24px'}}>
        <h1 style={{fontFamily: 'Georgia, serif', fontSize: '30px', color: '#0f172a', marginBottom: '8px', fontWeight: 400}}>Discover</h1>
        <p style={{color: '#94a3b8', fontSize: '14px'}}>Browse fragrances and find the best price from trusted discounters.</p>
      </div>

      <FragranceFilters onChange={setFilters} />

      <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '16px'}}>
        {filtered.length} fragrance{filtered.length !== 1 ? 's' : ''}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
        {filtered.map((fragrance) => {
          const sortedPrices = [...fragrance.discounterPrices].sort((a, b) => a.priceUsd - b.priceUsd)
          const lowestPrice = sortedPrices[0]
          const savings = lowestPrice ? (fragrance.retailPriceUsd ?? 0) - lowestPrice.priceUsd : 0

          return (
            <div key={fragrance.id} style={{border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', background: 'white'}}>
              <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px'}}>
                <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b'}}>
                  {fragrance.house.name}
                </div>
                {savings > 0 && (
                  <span style={{fontSize: '11px', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontWeight: 500}}>
                    Save ${Math.round(savings)}
                  </span>
                )}
              </div>
              <div style={{fontFamily: 'Georgia, serif', fontSize: '20px', color: '#0f172a', marginBottom: '12px'}}>
                {fragrance.name}
              </div>
              <div style={{display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap'}}>
                {fragrance.concentration && (
                  <span style={{fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '999px'}}>
                    {fragrance.concentration}
                  </span>
                )}
                {fragrance.occasion.slice(0, 2).map((o) => (
                  <span key={o} style={{fontSize: '11px', background: '#f8fafc', color: '#475569', padding: '2px 8px', borderRadius: '999px', textTransform: 'capitalize'}}>
                    {o}
                  </span>
                ))}
              </div>
              {fragrance.description && (
                <p style={{fontSize: '12px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.6}}>
                  {fragrance.description}
                </p>
              )}
              <div style={{borderTop: '1px solid #f8fafc', paddingTop: '16px'}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px'}}>
                  <span style={{fontSize: '12px', color: '#cbd5e1'}}>Retail</span>
                  <span style={{fontSize: '13px', color: '#cbd5e1', textDecoration: 'line-through'}}>
                    ${Number(fragrance.retailPriceUsd).toFixed(0)}
                  </span>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {sortedPrices.length > 0 ? sortedPrices.map((price) => (
                    
<a                       key={price.id}
                      href={price.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '999px', textDecoration: 'none'}}
                    >
                      {price.discounter.name} ${Number(price.priceUsd).toFixed(0)}
                    </a>
                  )) : (
                    <span style={{fontSize: '12px', color: '#cbd5e1'}}>No discounter prices available</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px'}}>
          No fragrances match these filters.
        </div>
      )}
    </div>
  )
}