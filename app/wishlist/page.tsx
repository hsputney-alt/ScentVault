import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Header from '../components/Header'
import WishlistClient from './WishlistClient'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function getUserWishlist(clerkId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  const wishlist = await prisma.userWishlist.findMany({
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

  return wishlist.map(w => ({
    id: w.fragrance.id,
    name: w.fragrance.name,
    concentration: w.fragrance.concentration,
    occasion: w.fragrance.occasion,
    season: w.fragrance.season,
    gender: w.fragrance.gender,
    retailPriceUsd: w.fragrance.retailPriceUsd ? Number(w.fragrance.retailPriceUsd) : null,
    notes: w.fragrance.notes.map(n => n.note.name),
    house: { name: w.fragrance.house.name, tier: w.fragrance.house.tier },
    discounterPrices: w.fragrance.discounterPrices.map(p => ({
      id: p.id,
      priceUsd: Number(p.priceUsd),
      affiliateUrl: p.affiliateUrl,
      discounter: { name: p.discounter.name },
    })),
  }))
}

export default async function WishlistPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const fragrances = await getUserWishlist(userId)

  return (
    <main className="min-h-screen bg-white">
      <Header active="/wishlist" />
      <WishlistClient fragrances={fragrances} />
    </main>
  )
}