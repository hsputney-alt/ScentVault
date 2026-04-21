'use client'

import { useState, useRef, useEffect } from 'react'

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

function Dropdown({
  label,
  options,
  value,
  onSelect,
}: {
  label: string
  options: string[]
  value: string
  onSelect: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const active = value !== 'All'

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          padding: '7px 14px',
          borderRadius: '999px',
          border: active ? '1px solid #1e3a5f' : '1px solid #e2e8f0',
          background: active ? '#1e3a5f' : 'white',
          color: active ? 'white' : '#475569',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        {active ? `${label}: ${value}` : label}
        <span style={{ fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            zIndex: 100,
            minWidth: '140px',
            overflow: 'hidden',
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); setOpen(false) }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '9px 16px',
                fontSize: '13px',
                background: value === opt ? '#eff6ff' : 'white',
                color: value === opt ? '#1e3a5f' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontWeight: value === opt ? 600 : 400,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

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
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Dropdown label="House" options={['All', 'Designer', 'Niche']} value={filters.category} onSelect={v => update('category', v)} />
        <Dropdown label="Gender" options={['All', 'Masculine', 'Feminine', 'Unisex']} value={filters.gender} onSelect={v => update('gender', v)} />
        <Dropdown label="Concentration" options={['All', 'EF', 'EDC', 'EDT', 'EDP', 'Parfum', 'Extrait']} value={filters.concentration} onSelect={v => update('concentration', v)} />
        {!hideOccasion && (
          <Dropdown label="Occasion" options={['All', 'Office', 'Casual', 'Date', 'Sport']} value={filters.occasion} onSelect={v => update('occasion', v)} />
        )}
        <Dropdown label="Time of Day" options={['All', 'Day', 'Night']} value={filters.timeOfDay} onSelect={v => update('timeOfDay', v)} />
        <Dropdown label="Season" options={['All', 'Spring', 'Summer', 'Fall', 'Winter']} value={filters.season} onSelect={v => update('season', v)} />

        {anyActive && (
          <button
            onClick={reset}
            style={{ fontSize: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}