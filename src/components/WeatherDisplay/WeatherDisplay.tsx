import { type Location } from '../../types/location';
import { type WeatherData } from '../../types/weather';
import styles from './WeatherDisplay.module.css';

interface WeatherDisplayProps {
	weather: WeatherData;
	location: Location;
}

const WeatherDisplay = ({ weather, location }: WeatherDisplayProps) => {
	return (
		<div className={styles.weatherCard}>
			<div className={styles.mainInfo}>
				<div className={styles.location}>
					<h2>{location.city}</h2>
					<p>{location.country}</p>
				</div>

				<div className={styles.temperature}>
					<span className={styles.tempValue}>{weather.temperature}°C</span>
					<span className={styles.feelsLike}>Ощущается как {weather.feelsLike}°C</span>
				</div>
			</div>

			<div className={styles.weatherDetails}>
				<div className={styles.weatherIcon}>
					<div className={styles.iconWrapper}>
						{weather.weatherCode === 0 && weather.isDay === 1 && '☀️'}
						{weather.weatherCode === 0 && weather.isDay === 0 && '🌙'}
						{[1, 2].includes(weather.weatherCode) && weather.isDay === 1 && '🌤️'}
						{[1, 2].includes(weather.weatherCode) && weather.isDay === 0 && '🌙'}
						{weather.weatherCode === 3 && '☁️'}
						{[45, 48].includes(weather.weatherCode) && '🌫️'}
						{[51, 53, 55, 56, 57].includes(weather.weatherCode) && '🌧️'}
						{[61, 63, 65, 66, 67, 80, 81, 82].includes(weather.weatherCode) && '🌧️'}
						{[71, 73, 75, 77, 85, 86].includes(weather.weatherCode) && '❄️'}
						{[95, 96, 99].includes(weather.weatherCode) && '⛈️'}
					</div>
					<p className={styles.description}>{weather.description}</p>
				</div>

				<div className={styles.details}>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Влажность</span>
						<span className={styles.detailValue}>{weather.humidity}%</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Ветер</span>
						<span className={styles.detailValue}>{weather.windSpeed} км/ч</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Давление</span>
						<span className={styles.detailValue}>{weather.pressure} гПа</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WeatherDisplay;
