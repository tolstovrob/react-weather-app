import { useState, useEffect } from 'react';
import type { Location } from '../types/location';

const DEFAULT_LOCATION: Location = {
	latitude: 55.7558,
	longitude: 37.6173,
	city: 'Москва',
	country: 'Россия',
};

/*
  Хук useLocation
  На вход не принимает ничего, возвращает текущее положение пользователя.
  Причём если получится, то он определит не только координаты, но и название страны и города.
  Для этого используется обратное геокодирование через API того же open-meteo
*/
export const useLocation = (): { location: Location; isLoading: boolean; error: string | null } => {
	const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLocationData = async (latitude: number, longitude: number) => {
			try {
				const response = await fetch(
					`https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1`,
				);

				if (!response.ok) {
					throw new Error('Не удалось получить текущую геолокацию');
				}

				const data = await response.json();

				if (data && data.results && data.results.length > 0) {
					const result = data.results[0];
					setLocation({
						latitude,
						longitude,
						city: result.name,
						country: result.country,
					});
				} else {
					setLocation({
						latitude,
						longitude,
						city: 'Неизвестно',
						country: 'Неизвестно',
					});
				}
			} catch (error) {
				console.error('Ошибка запроса:', error);
				setLocation({
					latitude,
					longitude,
					city: 'Неизвестно',
					country: 'Неизвестно',
				});
			} finally {
				setIsLoading(false);
			}
		};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					fetchLocationData(position.coords.latitude, position.coords.longitude);
				},
				(error) => {
					console.error('Ошибка определения геолокации:', error);
					setError('Не могу определить текущее положение. Ставлю Москву по умолчанию');
					setIsLoading(false);
					setLocation(DEFAULT_LOCATION);
				},
				{ timeout: 10000 },
			);
		} else {
			setError('Браузер не поддерживает Geolocation API. Ставлю Москву по умолчанию.');
			setIsLoading(false);
			setLocation(DEFAULT_LOCATION);
		}
	}, []);

	return { location, isLoading, error };
};
