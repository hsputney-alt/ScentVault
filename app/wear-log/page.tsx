import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Header from '../components/Header'
import WearLogClient from './WearLogClient'

const prisma = new PrismaClient()

async function getAllFragrances() {
  const fragrances = await prisma.fragrance.findMany({
    include: { house: true },
    orderBy: { name: 'asc' },
  })

  return fragrances.map(f => ({
    id: f.id,
    name: f.name,
    house: { name: f.house.name },
    concentration: f.concentration,
  }))
}

async function getWearLogs(clerkId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  const logs = await prisma.wearLog.findMany({
    where: { userId: user.id },
    include: {
      fragrance: { include: { house: true } },
    },
    orderBy: { wornDate: 'desc' },
  })

  return logs.map(l => ({
    id: l.id,
    wornDate: l.wornDate.toISOString(),
    occasion: l.occasion,
    notes: l.notes,
    fragrance: {
      name: l.fragrance.name,
      house: { name: l.fragrance.house.name },
      concentration: l.fragrance.concentration,
    },
  }))
}

export default async function WearLogPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const fragrances = await getAllFragrances()
  const logs = await getWearLogs(userId)

  return (
    <main style={{minHeight: '100vh', background: 'white'}}>
      <Header active="/wear-log" />
      <WearLogClient fragrances={fragrances} initialLogs={logs} />
    </main>
  )
}