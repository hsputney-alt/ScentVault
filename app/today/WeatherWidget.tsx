'use client'

import { useEffect, useState } from 'react'

type Weather = {
  temp: number
  description: string
  tip: string
}

function getTip(temp: number, weatherCode: number): string {
  if (temp >= 80) return 'Hot day — go for light, fresh colognes'
  if (temp >= 65) return 'Warm weather — great for citrus and aquatics'
  if (temp >= 50) return 'Cool and dry — great for heavier EDPs'
  if (temp >= 35) return 'Cold day — reach for your warmest orientals'
  return 'Freezing — time for your richest, heaviest scents'
}

function getDescription(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code <= 48) return 'Foggy'
  if (code <= 57) return 'Drizzle'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Rain showers'
  if (code <= 86) return 'Snow showers'
  return 'Thunderstorm'
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null)

  useEffect(() => {
    // Buffalo, NY coordinates
    fetch('https://api.open-meteo.com/v1/forecast?latitude=42.8864&longitude=-78.8784&current=temperature_2m,weather_code&temperature_unit=fahrenheit')
      .then(r => r.json())
      .then(data => {
        const temp = Math.round(data.current.temperature_2m)
        const code = data.current.weather_code
        setWeather({
          temp,
          description: getDescription(code),
          tip: getTip(temp, code),
        })
      })
      .catch(() => {
        setWeather({ temp: 0, description: 'Weather unavailable', tip: 'Check outside before spritzing' })
      })
  }, [])

  if (!weather) return null

  return (
    <div style={{border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: '16px', padding: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '400px', margin: '0 auto 32px'}}>
      <div style={{width: '48px', height: '48px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </div>
      <div>
        <div style={{fontSize: '11px', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px'}}>Buffalo, NY</div>
        <div style={{color: '#1e3a5f', fontWeight: 500, fontSize: '15px'}}>{weather.temp}°F · {weather.description}</div>
        <div style={{fontSize: '12px', color: '#64748b', marginTop: '2px'}}>{weather.tip}</div>
      </div>
    </div>
  )
}