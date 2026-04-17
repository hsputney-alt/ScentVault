'use client'

import { useState } from 'react'

export type FilterState = {
  category: string
  gender: string
  occasion: string
  timeOfDay: string
  season: string
  concentration: string
}

const defaultFilters: FilterState = {
  category: 'All',
  gender: 'All',
  occasion: 'All',
  timeOfDay: 'All',
  season: 'All',
  concentration: 'All',
}

type Props = {
  onChange: (filters: FilterState) => void
  hideOccasion?: boolean
}

const btn = (active: boolean) => ({
  padding: '6px 14px',
  borderRadius: '999px',
  border: active ? '1px solid #1e3a5f' : '1px solid #e2e8f0',
  background: active ? '#1e3a5f' : 'white',
  color: active ? 'white' : '#475569',
  fontSize: '12px',
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
})

export default function FragranceFilters({ onChange, hideOccasion }: Props) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  function update(key: keyof FilterState, value: string) {
    const next = { ...filters, [key]: filters[key] === value ? 'All' : value }
    setFilters(next)
    onChange(next)
  }

  function reset() {
    setFilters(defaultFilters)
    onChange(defaultFilters)
  }

  const anyActive = Object.values(filters).some(v => v !== 'All')

  return (
    <div style={{marginBottom: '32px'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>

        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
          <span style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '80px'}}>House</span>
          {['Designer', 'Niche'].map(f => (
            <button key={f} onClick={() => update('category', f)} style={btn(filters.category === f)}>{f}</button>
          ))}
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
          <span style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '80px'}}>Gender</span>
          {['Masculine', 'Feminine', 'Unisex'].map(f => (
            <button key={f} onClick={() => update('gender', f)} style={btn(filters.gender === f)}>{f}</button>
          ))}
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
          <span style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '80px'}}>Concentration</span>
          {['EF', 'EDC', 'EDT', 'EDP', 'Parfum', 'Extrait'].map(f => (
            <button key={f} onClick={() => update('concentration', f)} style={btn(filters.concentration === f)}>{f}</button>
          ))}
        </div>

        {!hideOccasion && (
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
            <span style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '80px'}}>Occasion</span>
            {['Office', 'Casual', 'Date', 'Sport'].map(f => (
              <button key={f} onClick={() => update('occasion', f)} style={btn(filters.occasion === f)}>{f}</button>
            ))}
          </div>
        )}

        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
          <span style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '80px'}}>Time of day</span>
          {['Day', 'Night'].map(f => (
            <button key={f} onClick={() => update('timeOfDay', f)} style={btn(filters.timeOfDay === f)}>{f}</button>
          ))}
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
          <span style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '80px'}}>Season</span>
          {['Spring', 'Summer', 'Fall', 'Winter'].map(f => (
            <button key={f} onClick={() => update('season', f)} style={btn(filters.season === f)}>{f}</button>
          ))}
        </div>

      </div>

      {anyActive && (
        <button
          onClick={reset}
          style={{marginTop: '12px', fontSize: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}
        >
          Clear filters
        </button>
      )}
    </div>
  )
}