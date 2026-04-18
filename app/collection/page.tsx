import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Header from '../components/Header'
import CollectionClient from './CollectionClient'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function getUserCollection(clerkId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  const collection = await prisma.userCollection.findMany({
    where: { userId: user.id },
    include: {
      fragrance: {
        include: {
          house: true,
          discounterPrices: { include: { discounter: true } },
          notes: { include: { note: true } },
        },
      },
    },
    orderBy: { addedAt: 'desc' },
  })

  return collection.map(c => ({
    entryId: c.id,
    purchasePrice: c.purchasePrice ? Number(c.purchasePrice) : null,
    id: c.fragrance.id,
    name: c.fragrance.name,
    concentration: c.fragrance.concentration,
    occasion: c.fragrance.occasion,
    season: c.fragrance.season,
    gender: c.fragrance.gender,
    retailPriceUsd: c.fragrance.retailPriceUsd ? Number(c.fragrance.retailPriceUsd) : null,
    sizeMl: c.fragrance.sizeMl ?? 100,
    longevity: c.fragrance.longevity,
    sillage: c.fragrance.sillage,
    notes: c.fragrance.notes.map(n => n.note.name),
    house: { name: c.fragrance.house.name, tier: c.fragrance.house.tier },
    discounterPrices: c.fragrance.discounterPrices.map(p => ({
      id: p.id,
      priceUsd: Number(p.priceUsd),
      affiliateUrl: p.affiliateUrl,
      discounter: { name: p.discounter.name },
    })),
  }))
}

export default async function CollectionPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const fragrances = await getUserCollection(userId)

  return (
    <main className="min-h-screen bg-white">
      <Header active="/collection" />
      <CollectionClient fragrances={fragrances} />
    </main>
  )
}