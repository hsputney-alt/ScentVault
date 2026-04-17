'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  onSearch?: (query: string) => void
  redirectToDiscover?: boolean
  placeholder?: string
  centered?: boolean
}

export default function SearchBar({ onSearch, redirectToDiscover, placeholder = 'Search fragrances, houses, notes...', centered }: Props) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (onSearch) onSearch(val)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && redirectToDiscover) {
      router.push(`/discover?q=${encodeURIComponent(query)}`)
    }
  }

  function handleSubmit() {
    if (redirectToDiscover) {
      router.push(`/discover?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', maxWidth: '560px', width: '100%', margin: centered ? '0 auto' : '0'}}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: '12px 20px',
          fontSize: '14px',
          border: '1px solid #e2e8f0',
          borderRight: 'none',
          borderRadius: '10px 0 0 10px',
          outline: 'none',
          color: '#0f172a',
          background: 'white',
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 20px',
          background: '#1e3a5f',
          color: 'white',
          border: '1px solid #1e3a5f',
          borderRadius: '0 10px 10px 0',
          fontSize: '14px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Search
      </button>
    </div>
  )
}