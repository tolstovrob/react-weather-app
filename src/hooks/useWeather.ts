import { useState, useEffect } from 'react';
import type { Location } from '../types/location';
import type { WeatherData, ForecastItem } from '../types/weather';

// NOTE(tolstovrob): Описание кодов погоды согласно WMO. Ознакомиться можно тут: https://open-meteo.com/en/docs
const weatherCodeMap: Record<number, string> = {
	0: 'Ясное небо',
	1: 'Преимущественно ясно',
	2: 'Переменная облачность',
	3: 'Пасмурно',
	45: 'Туман',
	48: 'Туман с инеем',
	51: 'Легкая морось',
	53: 'Умеренная морось',
	55: 'Сильная морось',
	56: 'Легкая ледяная морось',
	57: 'Сильная ледяная морось',
	61: 'Небольшой дождь',
	63: 'Умеренный дождь',
	65: 'Сильный дождь',
	66: 'Легкий ледяной дождь',
	67: 'Сильный ледяной дождь',
	71: 'Небольшой снегопад',
	73: 'Умеренный снегопад',
	75: 'Сильный снегопад',
	77: 'Снежная крупа',
	80: 'Небольшие ливни',
	81: 'Умеренные ливни',
	82: 'Сильные ливни',
	85: 'Небольшие снежные ливни',
	86: 'Сильные снежные ливни',
	95: 'Гроза',
	96: 'Гроза с небольшим градом',
	99: 'Гроза с сильным градом',
};

export const getWeatherDescription = (code: number): string => {
	return weatherCodeMap[code] || 'Неизвестно';
};

export const getWeatherIcon = (code: number, isDay = 1): string => {
	if (code === 0) return isDay ? 'clear-day' : 'clear-night';
	if (code === 1) return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
	if (code === 2) return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
	if (code === 3) return 'cloudy';
	if ([45, 48].includes(code)) return 'fog';
	if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
	if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
	if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
	if ([95, 96, 99].includes(code)) return 'thunderstorm';
	return 'default';
};

/*
  Хук useWeather
  На вход не принимает локацию, возвращает шестёрку с погодой, прогнозом, асинхронным лоадером и ошибкой,
  а также 2 колбека для получения (при необходимости) описания и иконки погоды. Пока что не реализовано
*/
export const useWeather = (location: Location) => {
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [forecast, setForecast] = useState<ForecastItem[]>([]);
	const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
	const [weatherError, setWeatherError] = useState<string | null>(null);

	useEffect(() => {
		const fetchWeatherData = async () => {
			if (!location) return;

			setIsLoadingWeather(true);

			try {
				const response = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,surface_pressure,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
				);

				if (!response.ok) {
					throw new Error('Failed to fetch weather data');
				}

				const data = await response.json();

				if (data.current) {
					setWeather({
						temperature: Math.round(data.current.temperature_2m),
						feelsLike: Math.round(data.current.apparent_temperature),
						description: getWeatherDescription(data.current.weather_code),
						weatherCode: data.current.weather_code,
						humidity: data.current.relative_humidity_2m,
						windSpeed: data.current.wind_speed_10m,
						pressure: data.current.pressure_msl || data.current.surface_pressure,
						isDay: data.current.is_day,
					});
				}

				if (data.daily) {
					const dailyForecasts: ForecastItem[] = [];

					for (let i = 0; i < data.daily.time.length; i++) {
						dailyForecasts.push({
							date: data.daily.time[i],
							temperature: {
								min: Math.round(data.daily.temperature_2m_min[i]),
								max: Math.round(data.daily.temperature_2m_max[i]),
							},
							weatherCode: data.daily.weather_code[i],
							precipitation: data.daily.precipitation_sum[i],
						});
					}

					setForecast(dailyForecasts);
				}
			} catch (error) {
				console.error('Error fetching weather data:', error);
				setWeatherError('Failed to fetch weather data. Please try again later.');
			} finally {
				setIsLoadingWeather(false);
			}
		};

		fetchWeatherData();
	}, [location]);

	return {
		weather,
		forecast,
		isLoadingWeather,
		weatherError,
		getWeatherDescription,
		getWeatherIcon,
	};
};
