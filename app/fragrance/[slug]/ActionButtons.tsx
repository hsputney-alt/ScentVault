'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function ActionButtons({ fragranceId }: { fragranceId: string }) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [collectionCount, setCollectionCount] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!isSignedIn) return
    fetch(`/api/collection?fragranceId=${fragranceId}`)
      .then(r => r.json())
      .then(d => setCollectionCount(d.count ?? 0))
    fetch(`/api/wishlist?fragranceId=${fragranceId}`)
      .then(r => r.json())
      .then(d => setInWishlist(d.inWishlist ?? false))
  }, [isSignedIn, fragranceId])

  async function handleAddToCollection() {
    if (!isSignedIn) { router.push('/sign-in'); return }
    setLoading(true)
    const res = await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fragranceId }),
    })
    const text = await res.text()
    console.log('API response:', text)
    try {
      const data = JSON.parse(text)
      setCollectionCount(data.count ?? collectionCount + 1)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (e) {
      console.error('Parse error:', e)
    }
    setLoading(false)
  }

  async function handleAddToWishlist() {
    if (!isSignedIn) { router.push('/sign-in'); return }
    setLoading(true)
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fragranceId }),
    })
    setInWishlist(true)
    setLoading(false)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
      <div style={{display: 'flex', gap: '12px'}}>
        <button
          onClick={handleAddToCollection}
          disabled={loading}
          style={{
            flex: 1,
            padding: '14px',
            background: '#1e3a5f',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Adding...' : justAdded ? '✓ Added!' : 'Add to collection'}
        </button>
        <button
          onClick={handleAddToWishlist}
          disabled={loading || inWishlist}
          style={{
            flex: 1,
            padding: '14px',
            background: 'white',
            color: inWishlist ? '#64748b' : '#1e3a5f',
            border: inWishlist ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: inWishlist ? 'default' : 'pointer',
          }}
        >
          {inWishlist ? '✓ In wishlist' : 'Add to wishlist'}
        </button>
      </div>
      {collectionCount > 0 && (
        <div style={{textAlign: 'center', fontSize: '13px', color: '#64748b'}}>
          You have {collectionCount} bottle{collectionCount !== 1 ? 's' : ''} of this in your collection
        </div>
      )}
      <div style={{textAlign: 'center'}}>
        <a href="/discover" style={{fontSize: '13px', color: '#94a3b8', textDecoration: 'none'}}>
          ← Back to discover
        </a>
      </div>
    </div>
  )
}