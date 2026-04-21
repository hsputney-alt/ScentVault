'use client'

import { useState, useMemo } from 'react'

type Fragrance = {
  id: string
  name: string
  house: { name: string }
  concentration: string | null
}

type WearLog = {
  id: string
  wornDate: string
  createdAt: string
  occasion: string | null
  notes: string | null
  fragrance: {
    name: string
    house: { name: string }
    concentration: string | null
  }
}

type Props = {
  fragrances: Fragrance[]
  initialLogs: WearLog[]
}

const occasions = ['Office', 'Casual', 'Date', 'Sport']
const timesOfDay = ['Day', 'Night']

function formatDate(iso: string) {
  const datePart = iso.split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function WearLogClient({ fragrances, initialLogs }: Props) {
  const [logs, setLogs] = useState<WearLog[]>(initialLogs)
  const [search, setSearch] = useState('')
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null)
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const searchResults = useMemo(() => {
    if (!search) return []
    const q = search.toLowerCase()
    return fragrances.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.house.name.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [search, fragrances])

  async function handleLog() {
    if (!selectedFragrance) return
    setLoading(true)

    const occasionValue = [selectedOccasion, selectedTimeOfDay].filter(Boolean).join(' · ') || null

    const res = await fetch('/api/wear-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fragranceId: selectedFragrance.id,
        occasion: occasionValue,
        notes: notes || null,
      }),
    })

    const data = await res.json()

    setLogs(prev => [{
      id: data.log.id,
      wornDate: data.log.wornDate,
      createdAt: data.log.createdAt ?? new Date().toISOString(),
      occasion: occasionValue,
      notes: notes || null,
      fragrance: {
        name: selectedFragrance.name,
        house: { name: selectedFragrance.house.name },
        concentration: selectedFragrance.concentration,
      },
    }, ...prev])

    setSearch('')
    setSelectedFragrance(null)
    setSelectedOccasion('')
    setSelectedTimeOfDay('')
    setNotes('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    setLoading(false)
  }

  async function handleRemove(logId: string) {
    setRemoving(logId)
    await fetch(`/api/wear-log/${logId}`, {
      method: 'DELETE',
    })
    setLogs(prev => prev.filter(l => l.id !== logId))
    setRemoving(null)
  }

  const grouped: Record<string, WearLog[]> = {}
  logs.forEach(log => {
    const date = formatDate(log.wornDate)
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(log)
  })

  const btnStyle = (active: boolean) => ({
    padding: '6px 14px',
    borderRadius: '999px',
    border: active ? '1px solid #1e3a5f' : '1px solid #e2e8f0',
    background: active ? '#1e3a5f' : 'white',
    color: active ? 'white' : '#475569',
    fontSize: '12px',
    cursor: 'pointer' as const,
  })

  return (
    <div style={{padding: '32px', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{marginBottom: '32px'}}>
        <h1 style={{fontFamily: 'Georgia, serif', fontSize: '30px', color: '#0f172a', marginBottom: '8px', fontWeight: 400}}>Wear log</h1>
        <p style={{color: '#94a3b8', fontSize: '14px'}}>Track what you wore and when — including samples and testers.</p>
      </div>

      <div style={{background: '#f8fafc', borderRadius: '16px', padding: '24px', marginBottom: '40px', border: '1px solid #e2e8f0'}}>
        <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px'}}>
          Log today
        </div>

        <div style={{marginBottom: '16px'}}>
          <div style={{fontSize: '12px', color: '#64748b', marginBottom: '6px'}}>What are you wearing?</div>
          <div style={{position: 'relative'}}>
            {selectedFragrance ? (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #bfdbfe', borderRadius: '8px', background: '#eff6ff'}}>
                <div>
                  <span style={{fontSize: '12px', color: '#64748b'}}>{selectedFragrance.house.name} — </span>
                  <span style={{fontSize: '14px', color: '#0f172a', fontWeight: 500}}>{selectedFragrance.name}</span>
                  {selectedFragrance.concentration && (
                    <span style={{fontSize: '12px', color: '#64748b'}}> ({selectedFragrance.concentration})</span>
                  )}
                </div>
                <button onClick={() => { setSelectedFragrance(null); setSearch('') }} style={{fontSize: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer'}}>✕</button>
              </div>
            ) : (
              <div>
                <div style={{display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: 'white'}}>
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowDropdown(true) }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search fragrances..."
                    style={{flex: 1, padding: '10px 14px', border: 'none', outline: 'none', fontSize: '14px', color: '#0f172a'}}
                  />
                </div>
                {showDropdown && searchResults.length > 0 && (
                  <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 10, marginTop: '4px'}}>
                    {searchResults.map(f => (
                      <button
                        key={f.id}
                        onClick={() => { setSelectedFragrance(f); setSearch(''); setShowDropdown(false) }}
                        style={{width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid #f8fafc', fontSize: '14px'}}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <span style={{fontSize: '11px', color: '#94a3b8', marginRight: '6px'}}>{f.house.name}</span>
                        <span style={{color: '#0f172a'}}>{f.name}</span>
                        {f.concentration && <span style={{fontSize: '11px', color: '#94a3b8', marginLeft: '6px'}}>({f.concentration})</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{marginBottom: '16px'}}>
          <div style={{fontSize: '12px', color: '#64748b', marginBottom: '8px'}}>Occasion</div>
          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
            {occasions.map(o => (
              <button key={o} onClick={() => setSelectedOccasion(prev => prev === o ? '' : o)} style={btnStyle(selectedOccasion === o)}>{o}</button>
            ))}
          </div>
        </div>

        <div style={{marginBottom: '20px'}}>
          <div style={{fontSize: '12px', color: '#64748b', marginBottom: '8px'}}>Time of day</div>
          <div style={{display: 'flex', gap: '8px'}}>
            {timesOfDay.map(t => (
              <button key={t} onClick={() => setSelectedTimeOfDay(prev => prev === t ? '' : t)} style={btnStyle(selectedTimeOfDay === t)}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{marginBottom: '20px'}}>
          <div style={{fontSize: '12px', color: '#64748b', marginBottom: '6px'}}>Notes (optional)</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did it perform? Any thoughts..."
            rows={2}
            style={{width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#0f172a', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}}
          />
        </div>

        <button
          onClick={handleLog}
          disabled={!selectedFragrance || loading}
          style={{padding: '12px 24px', background: selectedFragrance ? '#1e3a5f' : '#e2e8f0', color: selectedFragrance ? 'white' : '#94a3b8', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: selectedFragrance ? 'pointer' : 'default'}}
        >
          {loading ? 'Logging...' : success ? '✓ Logged!' : 'Log wear'}
        </button>
      </div>

      <div>
        <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '20px'}}>
          History
        </div>

        {logs.length === 0 ? (
          <div style={{textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px'}}>
            No wear logs yet. Log your first fragrance above!
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            {Object.entries(grouped).map(([date, dateLogs]) => (
              <div key={date}>
                <div style={{fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>
                  {date}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  {dateLogs.map(log => (
                    <div key={log.id} style={{border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px', background: 'white'}}>
                      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                        <div>
                          <div style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px'}}>
                            {log.fragrance.house.name}
                          </div>
                          <div style={{fontFamily: 'Georgia, serif', fontSize: '18px', color: '#0f172a', marginBottom: '6px'}}>
                            {log.fragrance.name}
                          </div>
                          <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                            {log.occasion && (
                              <span style={{fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '999px'}}>
                                {log.occasion}
                              </span>
                            )}
                            <span style={{fontSize: '11px', color: '#cbd5e1'}}>
                              {formatTime(log.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          {log.fragrance.concentration && (
                            <span style={{fontSize: '11px', background: '#f8fafc', color: '#64748b', padding: '2px 8px', borderRadius: '999px'}}>
                              {log.fragrance.concentration}
                            </span>
                          )}
                          <button
                            onClick={() => handleRemove(log.id)}
                            disabled={removing === log.id}
                            style={{fontSize: '11px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
                          >
                            {removing === log.id ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                      {log.notes && (
                        <div style={{marginTop: '10px', fontSize: '13px', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #f8fafc', paddingTop: '10px'}}>
                          {log.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}