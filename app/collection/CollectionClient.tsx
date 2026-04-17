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
  retailPriceUsd: number | null
  sizeMl: number
  longevity: number | null
  sillage: number | null
  house: { name: string; tier: string }
  discounterPrices: DiscounterPrice[]
}

type BottleState = {
  fullness: number
  sizeMl: number
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

function isFiltered(filters: FilterState) {
  return Object.values(filters).some(v => v !== 'All')
}

export default function CollectionClient({ fragrances }: { fragrances: Fragrance[] }) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All', gender: 'All', occasion: 'All', timeOfDay: 'All', season: 'All',
  })
  const [useOz, setUseOz] = useState(false)
  const [bottleStates, setBottleStates] = useState<Record<string, BottleState>>(() => {
    const initial: Record<string, BottleState> = {}
    fragrances.forEach(f => {
      initial[f.id] = { fullness: 10, sizeMl: f.sizeMl ?? 100 }
    })
    return initial
  })

  const filtered = applyFilters(fragrances, filters)
  const filtersActive = isFiltered(filters)

  const retailTotal = fragrances.reduce((sum, f) => sum + (f.retailPriceUsd ?? 0), 0)
  const paidTotal = fragrances.reduce((sum, f) => {
    const lowest = f.discounterPrices.reduce((min, p) => p.priceUsd < min ? p.priceUsd : min, Infinity)
    return sum + (lowest === Infinity ? (f.retailPriceUsd ?? 0) : lowest)
  }, 0)

  const totalMl = fragrances.reduce((sum, f) => {
    const state = bottleStates[f.id]
    if (!state) return sum
    return sum + (state.sizeMl * state.fullness / 10)
  }, 0)

  const filteredRetailTotal = filtered.reduce((sum, f) => sum + (f.retailPriceUsd ?? 0), 0)
  const filteredPaidTotal = filtered.reduce((sum, f) => {
    const lowest = f.discounterPrices.reduce((min, p) => p.priceUsd < min ? p.priceUsd : min, Infinity)
    return sum + (lowest === Infinity ? (f.retailPriceUsd ?? 0) : lowest)
  }, 0)
  const filteredMl = filtered.reduce((sum, f) => {
    const state = bottleStates[f.id]
    if (!state) return sum
    return sum + (state.sizeMl * state.fullness / 10)
  }, 0)

  function formatVolume(ml: number) {
    return useOz ? `${(ml / 29.5735).toFixed(1)} oz` : `${Math.round(ml)} mL`
  }

  function updateBottle(id: string, key: keyof BottleState, value: number) {
    setBottleStates(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }))
  }

  const volumeToggle = (
    <button
      onClick={() => setUseOz(prev => !prev)}
      style={{marginTop: '6px', fontSize: '11px', color: '#93c5fd', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline'}}
    >
      Switch to {useOz ? 'mL' : 'oz'}
    </button>
  )

  return (
    <div style={{padding: '32px', maxWidth: '1100px', margin: '0 auto'}}>

      {/* Main stats — always 5 boxes */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: filtersActive ? '12px' : '32px'}}>
        <div style={{background: '#f8fafc', borderRadius: '12px', padding: '16px'}}>
          <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>{fragrances.length}</div>
          <div style={{fontSize: '12px', color: '#64748b'}}>Bottles owned</div>
        </div>
        <div style={{background: '#f8fafc', borderRadius: '12px', padding: '16px'}}>
          <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>
            {new Set(fragrances.map(f => f.house.name)).size}
          </div>
          <div style={{fontSize: '12px', color: '#64748b'}}>Houses represented</div>
        </div>
        <div style={{background: '#f8fafc', borderRadius: '12px', padding: '16px'}}>
          <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>
            ${Math.round(retailTotal).toLocaleString()}
          </div>
          <div style={{fontSize: '12px', color: '#64748b'}}>Retail value</div>
        </div>
        <div style={{background: '#f8fafc', borderRadius: '12px', padding: '16px'}}>
          <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>
            ${Math.round(paidTotal).toLocaleString()}
          </div>
          <div style={{fontSize: '12px', color: '#64748b'}}>You paid</div>
        </div>
        <div style={{background: '#f8fafc', borderRadius: '12px', padding: '16px'}}>
          <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>
            {formatVolume(totalMl)}
          </div>
          <div style={{fontSize: '12px', color: '#64748b'}}>Volume owned</div>
          {volumeToggle}
        </div>
      </div>

      {/* Filtered stats — 5 boxes, only when filters active */}
      {filtersActive && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '32px'}}>
          <div style={{background: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid #bfdbfe'}}>
            <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>{filtered.length}</div>
            <div style={{fontSize: '12px', color: '#64748b'}}>Filtered bottles</div>
          </div>
          <div style={{background: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid #bfdbfe'}}>
            <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>
              {new Set(filtered.map(f => f.house.name)).size}
            </div>
            <div style={{fontSize: '12px', color: '#64748b'}}>Houses in filter</div>
          </div>
          <div style={{background: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid #bfdbfe'}}>
            <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>
              ${Math.round(filteredRetailTotal).toLocaleString()}
            </div>
            <div style={{fontSize: '12px', color: '#64748b'}}>Filtered retail value</div>
          </div>
          <div style={{background: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid #bfdbfe'}}>
            <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>
              ${Math.round(filteredPaidTotal).toLocaleString()}
            </div>
            <div style={{fontSize: '12px', color: '#64748b'}}>Filtered you paid</div>
          </div>
          <div style={{background: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid #bfdbfe'}}>
            <div style={{fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1e3a5f', marginBottom: '4px'}}>
              {formatVolume(filteredMl)}
            </div>
            <div style={{fontSize: '12px', color: '#64748b'}}>Filtered volume</div>
          </div>
        </div>
      )}

      <FragranceFilters onChange={setFilters} />

      <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '16px'}}>
        {filtered.length} fragrance{filtered.length !== 1 ? 's' : ''}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
        {filtered.map((fragrance) => {
          const lowest = fragrance.discounterPrices.reduce((min, p) => p.priceUsd < min ? p.priceUsd : min, Infinity)
          const youPaid = lowest === Infinity ? (fragrance.retailPriceUsd ?? 0) : lowest
          const state = bottleStates[fragrance.id] ?? { fullness: 10, sizeMl: fragrance.sizeMl ?? 100 }
          const remainingMl = state.sizeMl * state.fullness / 10

          return (
            <div key={fragrance.id} style={{border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', background: 'white'}}>
              <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px'}}>
                {fragrance.house.name}
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
              {fragrance.season.length > 0 && (
                <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                  {fragrance.season.map(s => (
                    <span key={s} style={{fontSize: '12px', color: '#64748b', textTransform: 'capitalize'}}>{s}</span>
                  ))}
                </div>
              )}

              <div style={{background: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '12px'}}>
                <div style={{display: 'flex', gap: '16px', marginBottom: '12px'}}>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Bottle size</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <input
                        type="number"
                        value={state.sizeMl}
                        min={1}
                        max={1000}
                        onChange={e => updateBottle(fragrance.id, 'sizeMl', Number(e.target.value))}
                        style={{width: '64px', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#0f172a'}}
                      />
                      <span style={{fontSize: '12px', color: '#64748b'}}>mL</span>
                    </div>
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Remaining</div>
                    <div style={{fontSize: '14px', fontWeight: 500, color: '#1e3a5f'}}>{formatVolume(remainingMl)}</div>
                  </div>
                </div>
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                    <span style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Fullness</span>
                    <span style={{fontSize: '12px', fontWeight: 500, color: '#1e3a5f'}}>{state.fullness}/10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={state.fullness}
                    onChange={e => updateBottle(fragrance.id, 'fullness', Number(e.target.value))}
                    style={{width: '100%', accentColor: '#1e3a5f'}}
                  />
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#cbd5e1', marginTop: '2px'}}>
                    <span>Almost empty</span>
                    <span>Full</span>
                  </div>
                </div>
              </div>

              <div style={{borderTop: '1px solid #f8fafc', paddingTop: '12px', display: 'flex', gap: '24px'}}>
                <div>
                  <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '2px'}}>Retail</div>
                  <div style={{fontSize: '14px', fontWeight: 500, color: '#475569'}}>${(fragrance.retailPriceUsd ?? 0).toFixed(0)}</div>
                </div>
                <div>
                  <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '2px'}}>You paid</div>
                  <div style={{fontSize: '14px', fontWeight: 500, color: '#1d4ed8'}}>${Math.round(youPaid)}</div>
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