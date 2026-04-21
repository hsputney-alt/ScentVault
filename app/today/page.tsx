import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Header from '../components/Header'
import TodayClient from './TodayClient'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function getCollectionFragrances(clerkId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  const collection = await prisma.userCollection.findMany({
    where: { userId: user.id },
    include: {
      fragrance: {
        include: {
          house: true,
          notes: { include: { note: true } },
        },
      },
    },
    orderBy: { fragrance: { name: 'asc' } },
  })

  return collection.map(c => ({
    id: c.fragrance.id,
    name: c.fragrance.name,
    concentration: c.fragrance.concentration,
    occasion: c.fragrance.occasion,
    season: c.fragrance.season,
    gender: c.fragrance.gender,
    longevity: c.fragrance.longevity,
    sillage: c.fragrance.sillage,
    notes: c.fragrance.notes.map(n => n.note.name),
    house: { name: c.fragrance.house.name, tier: c.fragrance.house.tier },
  }))
}

export default async function TodayPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const fragrances = await getCollectionFragrances(userId)

  return (
    <main style={{minHeight: '100vh', background: 'white'}}>
      <Header active="/today" />
      <TodayClient fragrances={fragrances} />
    </main>
  )
}