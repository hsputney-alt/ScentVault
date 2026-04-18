import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import Header from '../../components/Header'
import ActionButtons from './ActionButtons'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function getFragrance(slug: string) {
  const raw = await prisma.fragrance.findUnique({
    where: { slug },
    include: {
      house: true,
      notes: {
        include: { note: true },
        orderBy: { layer: 'asc' },
      },
      discounterPrices: {
        include: { discounter: true },
        orderBy: { priceUsd: 'asc' },
      },
    },
  })
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    concentration: raw.concentration,
    yearReleased: raw.yearReleased,
    perfumer: raw.perfumer,
    description: raw.description,
    retailPriceUsd: raw.retailPriceUsd ? Number(raw.retailPriceUsd) : null,
    sizeMl: raw.sizeMl,
    gender: raw.gender,
    season: raw.season,
    occasion: raw.occasion,
    longevity: raw.longevity,
    sillage: raw.sillage,
    house: { name: raw.house.name, tier: raw.house.tier },
    notes: raw.notes.map(n => ({
      layer: n.layer,
      name: n.note.name,
      family: n.note.family,
    })),
    discounterPrices: raw.discounterPrices.map(p => ({
      id: p.id,
      priceUsd: Number(p.priceUsd),
      affiliateUrl: p.affiliateUrl,
      discounter: { name: p.discounter.name },
    })),
  }
}

export default async function FragrancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fragrance = await getFragrance(slug)

  if (!fragrance) {
    return (
      <main style={{minHeight: '100vh', background: 'white'}}>
        <Header />
        <div style={{padding: '48px', textAlign: 'center', color: '#94a3b8'}}>
          Fragrance not found.
        </div>
      </main>
    )
  }

  const topNotes = fragrance.notes.filter(n => n.layer === 'top')
  const heartNotes = fragrance.notes.filter(n => n.layer === 'heart')
  const baseNotes = fragrance.notes.filter(n => n.layer === 'base')
  const lowestPrice = fragrance.discounterPrices[0]
  const savings = lowestPrice ? (fragrance.retailPriceUsd ?? 0) - lowestPrice.priceUsd : 0

  return (
    <main style={{minHeight: '100vh', background: 'white'}}>
      <Header />

      <div style={{maxWidth: '900px', margin: '0 auto', padding: '48px 32px'}}>

        <div style={{fontSize: '13px', color: '#94a3b8', marginBottom: '32px'}}>
          <Link href="/discover" style={{color: '#94a3b8', textDecoration: 'none'}}>Discover</Link>
          <span style={{margin: '0 8px'}}>›</span>
          <span>{fragrance.house.name}</span>
          <span style={{margin: '0 8px'}}>›</span>
          <span style={{color: '#0f172a'}}>{fragrance.name}</span>
        </div>

        <div style={{marginBottom: '48px'}}>
          <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px'}}>
            {fragrance.house.name} · {fragrance.house.tier === 'niche' ? 'Niche' : 'Designer'}
          </div>
          <h1 style={{fontFamily: 'Georgia, serif', fontSize: '42px', color: '#0f172a', fontWeight: 400, marginBottom: '16px', lineHeight: 1.1}}>
            {fragrance.name}
          </h1>
          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px'}}>
            {fragrance.concentration && (
              <span style={{fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '999px'}}>
                {fragrance.concentration}
              </span>
            )}
            {fragrance.gender && (
              <span style={{fontSize: '12px', background: '#f8fafc', color: '#475569', padding: '4px 10px', borderRadius: '999px', textTransform: 'capitalize'}}>
                {fragrance.gender}
              </span>
            )}
            {fragrance.yearReleased && (
              <span style={{fontSize: '12px', background: '#f8fafc', color: '#475569', padding: '4px 10px', borderRadius: '999px'}}>
                {fragrance.yearReleased}
              </span>
            )}
            {fragrance.sizeMl && (
              <span style={{fontSize: '12px', background: '#f8fafc', color: '#475569', padding: '4px 10px', borderRadius: '999px'}}>
                {fragrance.sizeMl}ml
              </span>
            )}
          </div>
          {fragrance.description && (
            <p style={{fontSize: '15px', color: '#475569', lineHeight: 1.8, maxWidth: '600px'}}>
              {fragrance.description}
            </p>
          )}
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px'}}>
          <div>
            <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '20px'}}>
              Fragrance notes
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {topNotes.length > 0 && (
                <div>
                  <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Top</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                    {topNotes.map(n => (
                      <span key={n.name} style={{fontSize: '13px', background: '#eff6ff', color: '#1e3a5f', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '999px'}}>
                        {n.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {heartNotes.length > 0 && (
                <div>
                  <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Heart</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                    {heartNotes.map(n => (
                      <span key={n.name} style={{fontSize: '13px', background: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '999px'}}>
                        {n.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {baseNotes.length > 0 && (
                <div>
                  <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Base</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                    {baseNotes.map(n => (
                      <span key={n.name} style={{fontSize: '13px', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '999px'}}>
                        {n.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '20px'}}>
              Performance
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {fragrance.longevity && (
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                    <span style={{fontSize: '13px', color: '#475569'}}>Longevity</span>
                    <span style={{fontSize: '13px', fontWeight: 500, color: '#1e3a5f'}}>{fragrance.longevity}/10</span>
                  </div>
                  <div style={{height: '4px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${fragrance.longevity * 10}%`, background: '#1e3a5f', borderRadius: '999px'}} />
                  </div>
                </div>
              )}
              {fragrance.sillage && (
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                    <span style={{fontSize: '13px', color: '#475569'}}>Sillage</span>
                    <span style={{fontSize: '13px', fontWeight: 500, color: '#1e3a5f'}}>{fragrance.sillage}/10</span>
                  </div>
                  <div style={{height: '4px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${fragrance.sillage * 10}%`, background: '#93c5fd', borderRadius: '999px'}} />
                  </div>
                </div>
              )}
              <div style={{marginTop: '8px'}}>
                <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Season</div>
                <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                  {fragrance.season.map(s => (
                    <span key={s} style={{fontSize: '12px', color: '#475569', background: '#f8fafc', padding: '3px 10px', borderRadius: '999px', textTransform: 'capitalize'}}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Occasion</div>
                <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                  {fragrance.occasion.map(o => (
                    <span key={o} style={{fontSize: '12px', color: '#475569', background: '#f8fafc', padding: '3px 10px', borderRadius: '999px', textTransform: 'capitalize'}}>
                      {o}
                    </span>
                  ))}
                </div>
              </div>
              {fragrance.perfumer && (
                <div>
                  <div style={{fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Perfumer</div>
                  <div style={{fontSize: '13px', color: '#475569'}}>{fragrance.perfumer}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{borderTop: '1px solid #f1f5f9', paddingTop: '40px', marginBottom: '48px'}}>
          <div style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '20px'}}>
            Best prices
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px'}}>
            <span style={{fontSize: '13px', color: '#94a3b8'}}>Retail</span>
            <span style={{fontSize: '16px', color: '#94a3b8', textDecoration: 'line-through'}}>${fragrance.retailPriceUsd?.toFixed(0)}</span>
            {savings > 0 && (
              <span style={{fontSize: '13px', background: '#f0fdf4', color: '#16a34a', padding: '2px 10px', borderRadius: '999px', fontWeight: 500}}>
                Save up to ${Math.round(savings)}
              </span>
            )}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {fragrance.discounterPrices.map((price, index) => (
              
                key={price.id}
                href={price.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  border: index === 0 ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                  borderRadius: '12px',
                  background: index === 0 ? '#f8fbff' : 'white',
                  textDecoration: 'none',
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  {index === 0 && (
                    <span style={{fontSize: '10px', background: '#1e3a5f', color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 500}}>
                      Best price
                    </span>
                  )}
                  <span style={{fontSize: '14px', color: '#1e293b', fontWeight: 500}}>{price.discounter.name}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <span style={{fontSize: '18px', fontWeight: 600, color: '#1d4ed8'}}>${price.priceUsd.toFixed(0)}</span>
                  <span style={{fontSize: '12px', color: '#93c5fd'}}>Shop →</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <ActionButtons fragranceId={fragrance.id} />

      </div>
    </main>
  )
}