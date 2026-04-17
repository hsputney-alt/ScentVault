import { PrismaClient } from '@prisma/client'
import Header from '../components/Header'
import TodayClient from './TodayClient'

const prisma = new PrismaClient()

async function getFragrances() {
  const raw = await prisma.fragrance.findMany({
    include: {
      house: true,
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
    longevity: f.longevity,
    sillage: f.sillage,
    notes: f.notes.map(n => n.note.name),
    house: { name: f.house.name, tier: f.house.tier },
  }))
}

export default async function TodayPage() {
  const fragrances = await getFragrances()

  return (
    <main className="min-h-screen bg-white">
      <Header active="/today" />
      <TodayClient fragrances={fragrances} />
    </main>
  )
}