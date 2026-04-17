'use client'

import { useState } from 'react'
import FragranceFilters, { FilterState } from '../components/FragranceFilters'
import SearchBar from '../components/SearchBar'

type Fragrance = {
  id: string
  name: string
  concentration: string | null
  occasion: string[]
  season: string[]
  gender: string
  longevity: number | null
  sillage: number | null
  house: { name: string; tier: string }
}

function applyFilters(fragrances: Fragrance[], filters: FilterState, query: string) {
  return fragrances.filter(f => {
    if (filters.category === 'Designer' && f.house.tier === 'niche') return false
    if (filters.category === 'Niche' && f.house.tier === 'designer') return false
    if (filters.gender !== 'All' && f.gender.toLowerCase() !== filters.gender.toLowerCase()) return false
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
        f.season.some(s => s.toLowerCase().includes(q))
      if (!matches) return false
    }
    return true
  })
}

const rankLabels = ['Best pick', 'Runner up', 'Also great']

export default function TodayClient({ fragrances }: { fragrances: Fragrance[] }) {
  const [activeOccasion, setActiveOccasion] = useState('office')
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    category: 'All', gender: 'All', occasion: 'All', timeOfDay: 'All', season: 'All', concentration: 'All',
  })

  const occasions = ['Office', 'Casual', 'Date', 'Sport']
  const prefiltered = applyFilters(fragrances, filters, query)
  const top3 = prefiltered.filter(f => f.occasion.map(o => o.toLowerCase()).includes(activeOccasion)).slice(0, 3)
  const rest = prefiltered.filter(f => f.occasion.map(o => o.toLowerCase()).includes(activeOccasion)).slice(3)
  const unrelated = prefiltered.filter(f => !f.occasion.map(o => o.toLowerCase()).includes(activeOccasion))

  return (
    <div style={{padding: '48px 32px', maxWidth: '1000px', margin: '0 auto'}}>
      <div style={{textAlign: 'center', marginBottom: '40px'}}>
        <h1 style={{fontFamily: 'Georgia, serif', fontSize: '30px', color: '#0f172a', marginBottom: '8px', fontWeight: 400}}>What should I wear today?</h1>
        <p style={{color: '#94a3b8', fontSize: '14px'}}>Pick an occasion and we will rank your collection for it.</p>
      </div>

      <div style={{border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: '16px', padding: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '400px', margin: '0 auto 32px'}}>
        <div style={{width: '48px', height: '48px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </div>
        <div>
          <div style={{fontSize: '11px', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px'}}>Buffalo, NY</div>
          <div style={{color: '#1e3a5f', fontWeight: 500, fontSize: '15px'}}>58°F · Partly cloudy</div>
          <div style={{fontSize: '12px', color: '#64748b', marginTop: '2px'}}>Cool and dry — great for heavier EDPs</div>
        </div>
      </div>

      <div style={{marginBottom: '32px'}}>
        <div style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px'}}>What is the occasion?</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
          {occasions.map((occasion) => (
            <button
              key={occasion}
              onClick={() => setActiveOccasion(occasion.toLowerCase())}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                border: occasion.toLowerCase() === activeOccasion ? '1px solid #1e3a5f' : '1px solid #e2e8f0',
                background: occasion.toLowerCase() === activeOccasion ? '#1e3a5f' : 'white',
                color: occasion.toLowerCase() === activeOccasion ? 'white' : '#475569',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {occasion}
            </button>
          ))}
        </div>
      </div>

      <div style={{marginBottom: '24px'}}>
        <SearchBar onSearch={setQuery} placeholder="Search your collection..." />
      </div>

      <div style={{marginBottom: '32px'}}>
        <FragranceFilters onChange={setFilters} hideOccasion />
      </div>

      {top3.length > 0 && (
        <div style={{marginBottom: '32px'}}>
          <div style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px'}}>
            Top picks for {activeOccasion}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
            {top3.map((fragrance, index) => (
              <div key={fragrance.id} style={{borderRadius: '16px', padding: '24px', border: index === 0 ? '1px solid #bfdbfe' : '1px solid #f1f5f9', background: index === 0 ? '#eff6ff' : 'white'}}>
                <div style={{marginBottom: '16px'}}>
                  <span style={{fontSize: '11px', fontWeight: 500, padding: '4px 10px', borderRadius: '999px', background: index === 0 ? '#1e3a5f' : '#f1f5f9', color: index === 0 ? 'white' : '#64748b', display: 'inline-block'}}>
                    {rankLabels[index]}
                  </span>
                </div>
                <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px'}}>
                  {fragrance.house.name}
                </div>
                <div style={{fontFamily: 'Georgia, serif', fontSize: '20px', color: '#0f172a', marginBottom: '12px'}}>
                  {fragrance.name}
                </div>
                {fragrance.concentration && (
                  <div style={{marginBottom: '16px'}}>
                    <span style={{fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '999px', display: 'inline-block'}}>
                      {fragrance.concentration}
                    </span>
                  </div>
                )}
                <div style={{display: 'flex', gap: '12px', fontSize: '12px', color: '#94a3b8'}}>
                  {fragrance.longevity && <span>Longevity {fragrance.longevity}/10</span>}
                  {fragrance.sillage && <span>Sillage {fragrance.sillage}/10</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div style={{marginBottom: '32px'}}>
          <div style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px'}}>Also works for {activeOccasion}</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {rest.map((fragrance) => (
              <div key={fragrance.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '12px 16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#bfdbfe', flexShrink: 0}} />
                  <span style={{fontSize: '12px', color: '#94a3b8', marginRight: '8px'}}>{fragrance.house.name}</span>
                  <span style={{fontSize: '14px', color: '#1e293b', fontWeight: 500}}>{fragrance.name}</span>
                </div>
                <div style={{display: 'flex', gap: '4px'}}>
                  {fragrance.occasion.slice(0, 2).map((o) => (
                    <span key={o} style={{fontSize: '11px', background: '#f8fafc', color: '#64748b', padding: '2px 8px', borderRadius: '999px', textTransform: 'capitalize'}}>{o}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {unrelated.length > 0 && (
        <div>
          <div style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px'}}>Not ideal for {activeOccasion}</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {unrelated.map((fragrance) => (
              <div key={fragrance.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '12px 16px', opacity: 0.4}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', flexShrink: 0}} />
                  <span style={{fontSize: '12px', color: '#94a3b8', marginRight: '8px'}}>{fragrance.house.name}</span>
                  <span style={{fontSize: '14px', color: '#1e293b', fontWeight: 500}}>{fragrance.name}</span>
                </div>
                <div style={{display: 'flex', gap: '4px'}}>
                  {fragrance.occasion.slice(0, 2).map((o) => (
                    <span key={o} style={{fontSize: '11px', background: '#f8fafc', color: '#64748b', padding: '2px 8px', borderRadius: '999px', textTransform: 'capitalize'}}>{o}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {top3.length === 0 && rest.length === 0 && (
        <div style={{textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px'}}>
          No fragrances match your search.
        </div>
      )}
    </div>
  )
}