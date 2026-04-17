import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function linkNote(fragranceId: string, noteId: string, layer: string) {
  await prisma.fragranceNote.upsert({
    where: { fragranceId_noteId_layer: { fragranceId, noteId, layer } },
    update: {},
    create: { fragranceId, noteId, layer },
  })
}

async function main() {
  console.log('Seeding...')

  // Discounters
  const fragranceX = await prisma.discounter.upsert({
    where: { name: 'FragranceX' },
    update: {},
    create: { name: 'FragranceX', baseUrl: 'https://www.fragrancex.com', network: 'commission_junction' },
  })
  const fragranceNet = await prisma.discounter.upsert({
    where: { name: 'FragranceNet' },
    update: {},
    create: { name: 'FragranceNet', baseUrl: 'https://www.fragrancenet.com', network: 'rakuten' },
  })
  const aura = await prisma.discounter.upsert({
    where: { name: 'Aura Fragrance' },
    update: {},
    create: { name: 'Aura Fragrance', baseUrl: 'https://aurafragrance.com', network: 'direct' },
  })

  // Houses
  const chanel = await prisma.fragranceHouse.upsert({ where: { name: 'Chanel' }, update: {}, create: { name: 'Chanel', tier: 'designer', country: 'France', founded: 1910 } })
  const dior = await prisma.fragranceHouse.upsert({ where: { name: 'Dior' }, update: {}, create: { name: 'Dior', tier: 'designer', country: 'France', founded: 1946 } })
  const tomFord = await prisma.fragranceHouse.upsert({ where: { name: 'Tom Ford' }, update: {}, create: { name: 'Tom Ford', tier: 'designer_niche', country: 'USA', founded: 2005 } })
  const creed = await prisma.fragranceHouse.upsert({ where: { name: 'Creed' }, update: {}, create: { name: 'Creed', tier: 'niche', country: 'France', founded: 1760 } })
  const versace = await prisma.fragranceHouse.upsert({ where: { name: 'Versace' }, update: {}, create: { name: 'Versace', tier: 'designer', country: 'Italy', founded: 1978 } })
  const armani = await prisma.fragranceHouse.upsert({ where: { name: 'Giorgio Armani' }, update: {}, create: { name: 'Giorgio Armani', tier: 'designer', country: 'Italy', founded: 1975 } })

  // Notes
  const bergamot = await prisma.note.upsert({ where: { name: 'Bergamot' }, update: {}, create: { name: 'Bergamot', family: 'citrus' } })
  const grapefruit = await prisma.note.upsert({ where: { name: 'Grapefruit' }, update: {}, create: { name: 'Grapefruit', family: 'citrus' } })
  const mint = await prisma.note.upsert({ where: { name: 'Mint' }, update: {}, create: { name: 'Mint', family: 'fresh' } })
  const ginger = await prisma.note.upsert({ where: { name: 'Ginger' }, update: {}, create: { name: 'Ginger', family: 'spicy' } })
  const incense = await prisma.note.upsert({ where: { name: 'Incense' }, update: {}, create: { name: 'Incense', family: 'oriental' } })
  const sandalwood = await prisma.note.upsert({ where: { name: 'Sandalwood' }, update: {}, create: { name: 'Sandalwood', family: 'woody' } })
  const vetiver = await prisma.note.upsert({ where: { name: 'Vetiver' }, update: {}, create: { name: 'Vetiver', family: 'woody' } })
  const lavender = await prisma.note.upsert({ where: { name: 'Lavender' }, update: {}, create: { name: 'Lavender', family: 'aromatic' } })
  const sichuanPepper = await prisma.note.upsert({ where: { name: 'Sichuan Pepper' }, update: {}, create: { name: 'Sichuan Pepper', family: 'spicy' } })
  const ambroxan = await prisma.note.upsert({ where: { name: 'Ambroxan' }, update: {}, create: { name: 'Ambroxan', family: 'oriental' } })
  const rosewood = await prisma.note.upsert({ where: { name: 'Rosewood' }, update: {}, create: { name: 'Rosewood', family: 'woody' } })
  const oud = await prisma.note.upsert({ where: { name: 'Oud' }, update: {}, create: { name: 'Oud', family: 'woody' } })
  const cardamom = await prisma.note.upsert({ where: { name: 'Cardamom' }, update: {}, create: { name: 'Cardamom', family: 'spicy' } })
  const amber = await prisma.note.upsert({ where: { name: 'Amber' }, update: {}, create: { name: 'Amber', family: 'oriental' } })
  const musk = await prisma.note.upsert({ where: { name: 'Musk' }, update: {}, create: { name: 'Musk', family: 'woody' } })
  const tobacco = await prisma.note.upsert({ where: { name: 'Tobacco' }, update: {}, create: { name: 'Tobacco', family: 'oriental' } })
  const vanilla = await prisma.note.upsert({ where: { name: 'Vanilla' }, update: {}, create: { name: 'Vanilla', family: 'gourmand' } })
  const tonkaBean = await prisma.note.upsert({ where: { name: 'Tonka Bean' }, update: {}, create: { name: 'Tonka Bean', family: 'oriental' } })
  const apple = await prisma.note.upsert({ where: { name: 'Apple' }, update: {}, create: { name: 'Apple', family: 'fresh' } })
  const rose = await prisma.note.upsert({ where: { name: 'Rose' }, update: {}, create: { name: 'Rose', family: 'floral' } })
  const oakmoss = await prisma.note.upsert({ where: { name: 'Oakmoss' }, update: {}, create: { name: 'Oakmoss', family: 'woody' } })
  const geranium = await prisma.note.upsert({ where: { name: 'Geranium' }, update: {}, create: { name: 'Geranium', family: 'floral' } })
  const sage = await prisma.note.upsert({ where: { name: 'Sage' }, update: {}, create: { name: 'Sage', family: 'aromatic' } })
  const patchouli = await prisma.note.upsert({ where: { name: 'Patchouli' }, update: {}, create: { name: 'Patchouli', family: 'woody' } })

  // Fragrances
  const bleuChanel = await prisma.fragrance.upsert({
    where: { slug: 'chanel-bleu-de-chanel-edp' },
    update: {},
    create: {
      houseId: chanel.id,
      name: 'Bleu de Chanel',
      slug: 'chanel-bleu-de-chanel-edp',
      concentration: 'EDP',
      yearReleased: 2014,
      perfumer: 'Olivier Polge',
      retailPriceUsd: 185,
      gender: 'masculine',
      season: ['fall', 'winter', 'spring'],
      occasion: ['office', 'casual', 'date'],
      longevity: 8,
      sillage: 7,
      description: 'A refined woody aromatic with citrus freshness and deep woody base.',
    },
  })

  const sauvage = await prisma.fragrance.upsert({
    where: { slug: 'dior-sauvage-edp' },
    update: {},
    create: {
      houseId: dior.id,
      name: 'Sauvage',
      slug: 'dior-sauvage-edp',
      concentration: 'EDP',
      yearReleased: 2018,
      perfumer: 'François Demachy',
      retailPriceUsd: 165,
      gender: 'masculine',
      season: ['fall', 'winter', 'spring'],
      occasion: ['office', 'casual', 'evening'],
      longevity: 9,
      sillage: 8,
      description: 'More lavender and amber depth than the EDT, with the signature ambroxan backbone.',
    },
  })

  const oudWood = await prisma.fragrance.upsert({
    where: { slug: 'tom-ford-oud-wood' },
    update: {},
    create: {
      houseId: tomFord.id,
      name: 'Oud Wood',
      slug: 'tom-ford-oud-wood',
      concentration: 'EDP',
      yearReleased: 2007,
      retailPriceUsd: 320,
      gender: 'unisex',
      season: ['fall', 'winter'],
      occasion: ['evening', 'date'],
      longevity: 8,
      sillage: 6,
      description: 'Warm, smooth, and creamy with rosewood and spice accents.',
    },
  })

  const tobaccoVanille = await prisma.fragrance.upsert({
    where: { slug: 'tom-ford-tobacco-vanille' },
    update: {},
    create: {
      houseId: tomFord.id,
      name: 'Tobacco Vanille',
      slug: 'tom-ford-tobacco-vanille',
      concentration: 'EDP',
      yearReleased: 2007,
      retailPriceUsd: 320,
      gender: 'unisex',
      season: ['fall', 'winter'],
      occasion: ['evening', 'date'],
      longevity: 9,
      sillage: 8,
      description: 'Rich tobacco, vanilla, and dried fruit — an addictively warm and sweet fragrance.',
    },
  })

  const aventus = await prisma.fragrance.upsert({
    where: { slug: 'creed-aventus' },
    update: {},
    create: {
      houseId: creed.id,
      name: 'Aventus',
      slug: 'creed-aventus',
      concentration: 'EDP',
      yearReleased: 2010,
      perfumer: 'Olivier Creed / Erwin Creed',
      retailPriceUsd: 495,
      gender: 'masculine',
      season: ['spring', 'summer', 'fall'],
      occasion: ['office', 'casual', 'date'],
      longevity: 8,
      sillage: 8,
      description: 'The modern benchmark for masculine fragrance.',
    },
  })

  const eros = await prisma.fragrance.upsert({
    where: { slug: 'versace-eros-edt' },
    update: {},
    create: {
      houseId: versace.id,
      name: 'Eros',
      slug: 'versace-eros-edt',
      concentration: 'EDT',
      yearReleased: 2012,
      perfumer: 'Alberto Morillas',
      retailPriceUsd: 95,
      gender: 'masculine',
      season: ['spring', 'summer'],
      occasion: ['casual', 'date'],
      longevity: 7,
      sillage: 8,
      description: 'Mint, green apple, and vanilla — a powerhouse casual fragrance.',
    },
  })

  const adgProfumo = await prisma.fragrance.upsert({
    where: { slug: 'armani-acqua-di-gio-profumo' },
    update: {},
    create: {
      houseId: armani.id,
      name: 'Acqua di Gio Profumo',
      slug: 'armani-acqua-di-gio-profumo',
      concentration: 'EDP',
      yearReleased: 2015,
      perfumer: 'Alberto Morillas',
      retailPriceUsd: 145,
      gender: 'masculine',
      season: ['spring', 'summer', 'fall'],
      occasion: ['casual', 'office'],
      longevity: 8,
      sillage: 7,
      description: 'Incense and geranium over a fresh marine base — the best in the AdG line.',
    },
  })

  // Discounter prices
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: bleuChanel.id, discounterId: fragranceX.id } }, update: {}, create: { fragranceId: bleuChanel.id, discounterId: fragranceX.id, priceUsd: 98, affiliateUrl: 'https://www.fragrancex.com/products/_cid_perfume-am-lid_B-am-pid_72150w' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: bleuChanel.id, discounterId: fragranceNet.id } }, update: {}, create: { fragranceId: bleuChanel.id, discounterId: fragranceNet.id, priceUsd: 104, affiliateUrl: 'https://www.fragrancenet.com/cologne/chanel/bleu-de-chanel' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: sauvage.id, discounterId: fragranceX.id } }, update: {}, create: { fragranceId: sauvage.id, discounterId: fragranceX.id, priceUsd: 82, affiliateUrl: 'https://www.fragrancex.com/products/_cid_perfume-am-lid_S-am-pid_76574w' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: sauvage.id, discounterId: fragranceNet.id } }, update: {}, create: { fragranceId: sauvage.id, discounterId: fragranceNet.id, priceUsd: 89, affiliateUrl: 'https://www.fragrancenet.com/cologne/christian-dior/sauvage' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: oudWood.id, discounterId: fragranceX.id } }, update: {}, create: { fragranceId: oudWood.id, discounterId: fragranceX.id, priceUsd: 189, affiliateUrl: 'https://www.fragrancex.com/products/_cid_perfume-am-lid_O-am-pid_48781w' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: tobaccoVanille.id, discounterId: fragranceX.id } }, update: {}, create: { fragranceId: tobaccoVanille.id, discounterId: fragranceX.id, priceUsd: 179, affiliateUrl: 'https://www.fragrancex.com/products/_cid_perfume-am-lid_T-am-pid_50879w' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: aventus.id, discounterId: fragranceX.id } }, update: {}, create: { fragranceId: aventus.id, discounterId: fragranceX.id, priceUsd: 289, affiliateUrl: 'https://www.fragrancex.com/products/_cid_perfume-am-lid_A-am-pid_63002w' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: eros.id, discounterId: fragranceX.id } }, update: {}, create: { fragranceId: eros.id, discounterId: fragranceX.id, priceUsd: 49, affiliateUrl: 'https://www.fragrancex.com/products/_cid_perfume-am-lid_E-am-pid_61636w' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: eros.id, discounterId: aura.id } }, update: {}, create: { fragranceId: eros.id, discounterId: aura.id, priceUsd: 51, affiliateUrl: 'https://aurafragrance.com/versace-eros' } })
  await prisma.discounterPrice.upsert({ where: { fragranceId_discounterId: { fragranceId: adgProfumo.id, discounterId: fragranceX.id } }, update: {}, create: { fragranceId: adgProfumo.id, discounterId: fragranceX.id, priceUsd: 74, affiliateUrl: 'https://www.fragrancex.com/products/_cid_perfume-am-lid_A-am-pid_70793w' } })

  // Fragrance notes
  await linkNote(bleuChanel.id, grapefruit.id, 'top')
  await linkNote(bleuChanel.id, mint.id, 'top')
  await linkNote(bleuChanel.id, ginger.id, 'heart')
  await linkNote(bleuChanel.id, incense.id, 'heart')
  await linkNote(bleuChanel.id, sandalwood.id, 'base')
  await linkNote(bleuChanel.id, vetiver.id, 'base')

  await linkNote(sauvage.id, bergamot.id, 'top')
  await linkNote(sauvage.id, lavender.id, 'heart')
  await linkNote(sauvage.id, sichuanPepper.id, 'heart')
  await linkNote(sauvage.id, ambroxan.id, 'base')
  await linkNote(sauvage.id, vetiver.id, 'base')

  await linkNote(oudWood.id, rosewood.id, 'top')
  await linkNote(oudWood.id, oud.id, 'heart')
  await linkNote(oudWood.id, cardamom.id, 'heart')
  await linkNote(oudWood.id, amber.id, 'base')
  await linkNote(oudWood.id, musk.id, 'base')

  await linkNote(tobaccoVanille.id, tobacco.id, 'top')
  await linkNote(tobaccoVanille.id, vanilla.id, 'heart')
  await linkNote(tobaccoVanille.id, tonkaBean.id, 'base')
  await linkNote(tobaccoVanille.id, musk.id, 'base')

  await linkNote(aventus.id, apple.id, 'top')
  await linkNote(aventus.id, bergamot.id, 'top')
  await linkNote(aventus.id, rose.id, 'heart')
  await linkNote(aventus.id, oakmoss.id, 'base')
  await linkNote(aventus.id, musk.id, 'base')
  await linkNote(aventus.id, amber.id, 'base')

  await linkNote(eros.id, mint.id, 'top')
  await linkNote(eros.id, apple.id, 'top')
  await linkNote(eros.id, lavender.id, 'heart')
  await linkNote(eros.id, vanilla.id, 'base')
  await linkNote(eros.id, tonkaBean.id, 'base')
  await linkNote(eros.id, oakmoss.id, 'base')

  await linkNote(adgProfumo.id, bergamot.id, 'top')
  await linkNote(adgProfumo.id, geranium.id, 'heart')
  await linkNote(adgProfumo.id, sage.id, 'heart')
  await linkNote(adgProfumo.id, incense.id, 'base')
  await linkNote(adgProfumo.id, patchouli.id, 'base')

  console.log('✅ Seed complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())