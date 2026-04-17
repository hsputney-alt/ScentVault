import Link from 'next/link'

type Props = {
  active?: string
}

export default function Header({ active }: Props) {
  const navLinks = [
    { href: '/collection', label: 'My collection' },
    { href: '/discover', label: 'Discover' },
    { href: '/wishlist', label: 'Wishlist' },
    { href: '/today', label: 'Wear today' },
  ]

  return (
    <header style={{borderBottom: '1px solid #f1f5f9', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white'}}>
      <Link href="/" style={{fontFamily: 'Georgia, serif', fontSize: '22px', color: '#1e3a5f', textDecoration: 'none', letterSpacing: '0.06em', flexShrink: 0}}>
        Scent<span style={{fontStyle: 'italic', color: '#93c5fd'}}>Vault</span>
      </Link>

      <nav style={{display: 'flex', gap: '32px', fontSize: '14px'}}>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: active === link.href ? '#1e3a5f' : '#64748b',
              textDecoration: 'none',
              fontWeight: active === link.href ? 500 : 400,
              borderBottom: active === link.href ? '1.5px solid #1e3a5f' : 'none',
              paddingBottom: active === link.href ? '2px' : '0',
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0}}>
        <button style={{fontSize: '14px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer'}}>
          Sign in
        </button>
        <button style={{fontSize: '14px', background: '#1e3a5f', color: 'white', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer'}}>
          Get started
        </button>
      </div>
    </header>
  )
}