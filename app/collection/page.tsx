import { PrismaClient } from '@prisma/client'
import Header from '../components/Header'
import CollectionClient from './CollectionClient'

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
    concentration: f.concentration,
    occasion: f.occasion,
    season: f.season,
    gender: f.gender,
    retailPriceUsd: f.retailPriceUsd ? Number(f.retailPriceUsd) : null,
    sizeMl: f.sizeMl ?? 100,
    longevity: f.longevity,
    sillage: f.sillage,
    notes: f.notes.map(n => n.note.name),
    house: { name: f.house.name, tier: f.house.tier },
    discounterPrices: f.discounterPrices.map(p => ({
      id: p.id,
      priceUsd: Number(p.priceUsd),
      affiliateUrl: p.affiliateUrl,
      discounter: { name: p.discounter.name },
    })),
  }))
}

export default async function CollectionPage() {
  const fragrances = await getFragrances()

  return (
    <main className="min-h-screen bg-white">
      <Header active="/collection" />
      <CollectionClient fragrances={fragrances} />
    </main>
  )
}