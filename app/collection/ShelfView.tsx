'use client'

import { useState } from 'react'

type Fragrance = {
  id: string
  name: string
  house: { name: string }
  sizeMl: number
  concentration: string | null
}

type BottleState = {
  fullness: number
  sizeMl: number
}

type Props = {
  fragrances: Fragrance[]
  bottleStates: Record<string, BottleState>
}

const BOTTLE_COLORS = [
  '#bfdbfe', '#c7d2fe', '#ddd6fe', '#fbcfe8', '#fde68a',
  '#a7f3d0', '#bae6fd', '#e9d5ff', '#fecaca', '#d1fae5',
]

function Bottle({ fragrance, bottleState, color, index }: {
  fragrance: Fragrance
  bottleState: BottleState
  color: string
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const sizeMl = bottleState.sizeMl
  const fullness = bottleState.fullness / 10

  const baseHeight = 120
  const minHeight = 80
  const maxHeight = 160
  const height = Math.min(maxHeight, Math.max(minHeight, baseHeight * (sizeMl / 100)))
  const width = 44
  const neckHeight = 20
  const neckWidth = 16
  const bodyHeight = height - neckHeight
  const liquidHeight = bodyHeight * fullness
  const svgHeight = height + 40

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.15s',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width={width + 20} height={svgHeight} viewBox={`0 0 ${width + 20} ${svgHeight}`}>
        {/* Cap */}
        <rect
          x={10 + (width - neckWidth) / 2 - 2}
          y={4}
          width={neckWidth + 4}
          height={10}
          rx={3}
          fill={color}
          opacity={0.9}
        />
        {/* Neck */}
        <rect
          x={10 + (width - neckWidth) / 2}
          y={14}
          width={neckWidth}
          height={neckHeight}
          fill={color}
          opacity={0.5}
        />
        {/* Body outline */}
        <rect
          x={10}
          y={14 + neckHeight}
          width={width}
          height={bodyHeight}
          rx={6}
          fill="white"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.9}
        />
        {/* Liquid */}
        <clipPath id={`clip-${fragrance.id}`}>
          <rect
            x={10}
            y={14 + neckHeight}
            width={width}
            height={bodyHeight}
            rx={6}
          />
        </clipPath>
        <rect
          x={10}
          y={14 + neckHeight + (bodyHeight - liquidHeight)}
          width={width}
          height={liquidHeight}
          fill={color}
          opacity={0.35}
          clipPath={`url(#clip-${fragrance.id})`}
        />
        {/* Fullness label inside bottle */}
        {fullness > 0.25 && (
          <text
            x={10 + width / 2}
            y={14 + neckHeight + bodyHeight - 8}
            textAnchor="middle"
            fontSize={9}
            fill="#1e3a5f"
            opacity={0.6}
          >
            {Math.round(fullness * 100)}%
          </text>
        )}
      </svg>

      {/* Label */}
      <div style={{
        textAlign: 'center',
        maxWidth: '70px',
        marginTop: '4px',
      }}>
        <div style={{
          fontSize: '9px',
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '70px',
        }}>
          {fragrance.house.name}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#1e3a5f',
          fontFamily: 'Georgia, serif',
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          maxWidth: '70px',
        }}>
          {fragrance.name}
        </div>
        <div style={{fontSize: '9px', color: '#cbd5e1', marginTop: '2px'}}>
          {bottleState.sizeMl}mL
        </div>
      </div>
    </div>
  )
}

function Shelf({ fragrances, bottleStates, startIndex }: {
  fragrances: Fragrance[]
  bottleStates: Record<string, BottleState>
  startIndex: number
}) {
  return (
    <div style={{marginBottom: '48px', position: 'relative'}}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        paddingBottom: '16px',
        paddingLeft: '24px',
        paddingRight: '24px',
        minHeight: '220px',
        flexWrap: 'nowrap',
        overflowX: 'auto',
      }}>
        {fragrances.map((fragrance, i) => (
          <Bottle
            key={fragrance.id}
            fragrance={fragrance}
            bottleState={bottleStates[fragrance.id] ?? { fullness: 10, sizeMl: fragrance.sizeMl ?? 100 }}
            color={BOTTLE_COLORS[(startIndex + i) % BOTTLE_COLORS.length]}
            index={startIndex + i}
          />
        ))}
      </div>
      {/* Shelf board */}
      <div style={{
        height: '10px',
        background: 'linear-gradient(to bottom, #e2e8f0, #cbd5e1)',
        borderRadius: '2px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
        marginLeft: '8px',
        marginRight: '8px',
      }} />
      {/* Shelf shadow */}
      <div style={{
        height: '6px',
        background: 'rgba(0,0,0,0.04)',
        marginLeft: '16px',
        marginRight: '16px',
        borderRadius: '0 0 4px 4px',
      }} />
    </div>
  )
}

export default function ShelfView({ fragrances, bottleStates }: Props) {
  const perShelf = 8
  const shelves = []
  for (let i = 0; i < fragrances.length; i += perShelf) {
    shelves.push(fragrances.slice(i, i + perShelf))
  }

  if (fragrances.length === 0) {
    return (
      <div style={{textAlign: 'center', padding: '64px', color: '#94a3b8', fontSize: '14px'}}>
        No fragrances match your filters.
      </div>
    )
  }

  return (
    <div style={{
      background: '#f8fafc',
      borderRadius: '20px',
      padding: '40px 24px 24px',
      border: '1px solid #e2e8f0',
    }}>
      {/* Cabinet top */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        fontSize: '11px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        {fragrances.length} bottle{fragrances.length !== 1 ? 's' : ''} on display
      </div>

      {shelves.map((shelfFragrances, i) => (
        <Shelf
          key={i}
          fragrances={shelfFragrances}
          bottleStates={bottleStates}
          startIndex={i * perShelf}
        />
      ))}
    </div>
  )
}