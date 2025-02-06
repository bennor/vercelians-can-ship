"use client"

import { useState, useEffect } from "react"

interface WeatherData {
  current: {
    temperature_2m: number
    weather_code: number
  }
  current_units: {
    temperature_2m: string
  }
}

export function getTemperatureEmoji(temperature: number): string {
  if (temperature < 0) return "🥶"
  if (temperature < 10) return "❄️"
  if (temperature < 20) return "😎"
  if (temperature < 30) return "☀️"
  return "🔥"
}

function getWeatherEmoji(weatherCode: number): string {
  if (weatherCode >= 0 && weatherCode <= 3) return "☀️" // Clear to partly cloudy
  if (weatherCode >= 45 && weatherCode <= 48) return "🌫️" // Fog
  if (weatherCode >= 51 && weatherCode <= 67) return "🌧️" // Drizzle to freezing rain
  if (weatherCode >= 71 && weatherCode <= 77) return "❄️" // Snow
  if (weatherCode >= 80 && weatherCode <= 82) return "🌦️" // Rain showers
  if (weatherCode >= 85 && weatherCode <= 86) return "🌨️" // Snow showers
  if (weatherCode >= 95 && weatherCode <= 99) return "⛈️" // Thunderstorm
  return "🌡️" // Default
}

function getWeatherDescription(weatherCode: number): string {
  if (weatherCode >= 0 && weatherCode <= 3) return "Clear to partly cloudy"
  if (weatherCode >= 45 && weatherCode <= 48) return "Foggy"
  if (weatherCode >= 51 && weatherCode <= 67) return "Rainy"
  if (weatherCode >= 71 && weatherCode <= 77) return "Snowy"
  if (weatherCode >= 80 && weatherCode <= 82) return "Rain showers"
  if (weatherCode >= 85 && weatherCode <= 86) return "Snow showers"
  if (weatherCode >= 95 && weatherCode <= 99) return "Thunderstorm"
  return "Unknown weather"
}

function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function MyV0Component() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-37.81&longitude=144.96&current=temperature_2m,weather_code",
        )
        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }
        const data: WeatherData = await response.json()
        setWeatherData(data)
        setLoading(false)
      } catch (err) {
        setError("Error fetching weather data")
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-zinc-800 text-sm">Loading weather data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h3 className="text-sm font-medium text-zinc-500 mb-2">Melbourne</h3>
      {weatherData && (
        <>
          <div className="flex flex-col items-center justify-center">
            <span className="text-7xl mb-2">{getTemperatureEmoji(weatherData.current.temperature_2m)}</span>
            <div className="flex items-center text-4xl font-medium text-zinc-800">
              <span>{Math.round(weatherData.current.temperature_2m)}°C</span>
              <span className="text-lg text-zinc-400 ml-2">
                ({Math.round(celsiusToFahrenheit(weatherData.current.temperature_2m))}°F)
              </span>
            </div>
          </div>
          <div className="flex items-center text-sm text-zinc-600 mt-2">
            <span className="mr-1">{getWeatherEmoji(weatherData.current.weather_code)}</span>
            <span>{getWeatherDescription(weatherData.current.weather_code)}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default MyV0Component