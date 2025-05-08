import type { ForecastItem } from "../../types/weather"
import { getWeatherDescription } from "../../hooks/useWeather"
import styles from "./ForecastList.module.css"

interface ForecastListProps {
  forecast: ForecastItem[]
}

const ForecastList = ({ forecast }: ForecastListProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("ru-RU", { weekday: "short", month: "short", day: "numeric" })
  }

  const getWeatherEmoji = (code: number) => {
    if (code === 0) return "☀️"
    if ([1, 2].includes(code)) return "🌤️"
    if (code === 3) return "☁️"
    if ([45, 48].includes(code)) return "🌫️"
    if ([51, 53, 55, 56, 57].includes(code)) return "🌧️"
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️"
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️"
    if ([95, 96, 99].includes(code)) return "⛈️"
    return "🌡️"
  }

  return (
    <div className={styles.forecastList}>
      {forecast.map((item, index) => (
        <div key={index} className={styles.forecastItem}>
          <div className={styles.forecastDate}>{formatDate(item.date)}</div>
          <div className={styles.forecastIcon}>{getWeatherEmoji(item.weatherCode)}</div>
          <div className={styles.forecastTemp}>
            <span className={styles.maxTemp}>{item.temperature.max}°</span>
            <span className={styles.minTemp}>{item.temperature.min}°</span>
          </div>
          <div className={styles.forecastDesc}>{getWeatherDescription(item.weatherCode)}</div>
          {item.precipitation > 0 && (
            <div className={styles.precipitation}>
              <span>💧 {item.precipitation} мм</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ForecastList