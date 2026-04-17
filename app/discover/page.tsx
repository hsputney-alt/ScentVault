import { PrismaClient } from '@prisma/client'
import Header from '../components/Header'
import DiscoverClient from './DiscoverClient'

const prisma = new PrismaClient()

async function getFragrances() {
  const raw = await prisma.fragrance.findMany({
    include: {
      house: true,
      discounterPrices: {
        include: { discounter: true },
      },
      notes: {
        include: { note: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return raw.map(f => ({
    id: f.id,
    name: f.name,
    slug: f.slug,
    concentration: f.concentration,
    occasion: f.occasion,
    season: f.season,
    gender: f.gender,
    description: f.description,
    retailPriceUsd: f.retailPriceUsd ? Number(f.retailPriceUsd) : null,
    house: { name: f.house.name, tier: f.house.tier },
    notes: f.notes.map(n => n.note.name),
    discounterPrices: f.discounterPrices.map(p => ({
      id: p.id,
      priceUsd: Number(p.priceUsd),
      affiliateUrl: p.affiliateUrl,
      discounter: { name: p.discounter.name },
    })),
  }))
}

export default async function DiscoverPage() {
  const fragrances = await getFragrances()

  return (
    <main className="min-h-screen bg-white">
      <Header active="/discover" />
      <DiscoverClient fragrances={fragrances} />
    </main>
  )
}