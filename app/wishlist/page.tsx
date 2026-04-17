import { PrismaClient } from '@prisma/client'
import Header from '../components/Header.tsx'
import WishlistClient from './WishlistClient'

const prisma = new PrismaClient()

async function getFragrances() {
  const raw = await prisma.fragrance.findMany({
    include: {
      house: true,
      discounterPrices: {
        include: { discounter: true },
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
    house: { name: f.house.name, tier: f.house.tier },
    discounterPrices: f.discounterPrices.map(p => ({
      id: p.id,
      priceUsd: Number(p.priceUsd),
      affiliateUrl: p.affiliateUrl,
      discounter: { name: p.discounter.name },
    })),
  }))
}

export default async function WishlistPage() {
  const fragrances = await getFragrances()

  return (
    <main className="min-h-screen bg-white">
      <Header active="/wishlist" />
      <WishlistClient fragrances={fragrances} />
    </main>
  )
}