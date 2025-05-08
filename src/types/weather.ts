export interface WeatherData {
	temperature: number;
	feelsLike: number;
	description: string;
	weatherCode: number;
	humidity: number;
	windSpeed: number;
	pressure: number;
	isDay: number;
}

export interface ForecastItem {
	date: string;
	temperature: {
		min: number;
		max: number;
	};
	weatherCode: number;
	precipitation: number;
}
