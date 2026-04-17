'use client'

import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs'

export default function AuthButtons() {
  const { isSignedIn } = useAuth()

  return (
    <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0}}>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <>
          <SignInButton mode="redirect">
            <button style={{fontSize: '14px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer'}}>
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="redirect">
            <button style={{fontSize: '14px', background: '#1e3a5f', color: 'white', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer'}}>
              Get started
            </button>
          </SignUpButton>
        </>
      )}
    </div>
  )
}