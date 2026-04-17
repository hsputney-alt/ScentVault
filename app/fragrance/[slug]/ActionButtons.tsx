'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function ActionButtons({ fragranceId }: { fragranceId: string }) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [addedToCollection, setAddedToCollection] = useState(false)
  const [addedToWishlist, setAddedToWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAddToCollection() {
    if (!isSignedIn) { router.push('/sign-in'); return }
    setLoading(true)
    await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fragranceId }),
    })
    setAddedToCollection(true)
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
    setAddedToWishlist(true)
    setLoading(false)
  }

  return (
    <div style={{display: 'flex', gap: '12px'}}>
      <button
        onClick={handleAddToCollection}
        disabled={loading || addedToCollection}
        style={{
          flex: 1,
          padding: '14px',
          background: addedToCollection ? '#e2e8f0' : '#1e3a5f',
          color: addedToCollection ? '#64748b' : 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: addedToCollection ? 'default' : 'pointer',
        }}
      >
        {addedToCollection ? '✓ Added to collection' : 'Add to collection'}
      </button>
      <button
        onClick={handleAddToWishlist}
        disabled={loading || addedToWishlist}
        style={{
          flex: 1,
          padding: '14px',
          background: 'white',
          color: addedToWishlist ? '#64748b' : '#1e3a5f',
          border: addedToWishlist ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: addedToWishlist ? 'default' : 'pointer',
        }}
      >
        {addedToWishlist ? '✓ Added to wishlist' : 'Add to wishlist'}
      </button>
    </div>
  )
}