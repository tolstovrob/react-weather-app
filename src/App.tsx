import { useState, useEffect } from 'react';
import { useLocation } from './hooks/useLocation';
import { useWeather } from './hooks/useWeather';
import WeatherDisplay from './components/WeatherDisplay';
import styles from "./App.module.css"
import LoadingFallback from './components/LoaderFallback';
import ErrorFallback from './components/ErrorFallback';
import ForecastList from './components/ForecastList/ForecastList';

const App = () => {
	const { location, error: locationError, isLoading: isLoadingLocation } = useLocation()
  const { weather, forecast, isLoadingWeather, weatherError } = useWeather(location)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString(["ru-RU"], { hour: "2-digit", minute: "2-digit", hour12: false }))
      setCurrentDate(now.toLocaleDateString(["ru-RU"], { weekday: "long", year: "numeric", month: "long", day: "numeric" }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  if (isLoadingLocation || isLoadingWeather) {
    return <LoadingFallback />
  }

  if ((locationError && !location) || weatherError) {
    return <ErrorFallback error={locationError || weatherError} />
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Погода</h1>
          <p className={styles.date}>{currentDate}</p>
        </div>
        <div className={styles.time}>{currentTime}</div>
      </div>

      {weather && <WeatherDisplay weather={weather} location={location} />}

      {forecast && forecast.length > 0 && (
        <div className={styles.forecastContainer}>
          <h2 className={styles.forecastTitle}>Прогноз</h2>
          <ForecastList forecast={forecast} />
        </div>
      )}

      <footer className={styles.footer}>
        <p>
          Источник: {" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
            Open-Meteo
          </a>. @tolstovrob
        </p>
      </footer>
    </main>
	);
};

export default App;
