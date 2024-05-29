import React, { useState } from 'react';
import './App.css';

function App() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyData, setHourlyData] = useState(null);

    const apiKey = process.env.REACT_APP_API_KEY;

    const getWeather = () => {
        if (!city) {
            alert('Please enter a city');
            return;
        }

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error);
                alert('Error fetching current weather data. Please try again.');
            });

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                setHourlyData(data.list);
            })
            .catch(error => {
                console.error('Error fetching hourly forecast data:', error);
                alert('Error fetching hourly forecast data. Please try again.');
            });
    };

    const displayWeather = () => {
        if (weatherData && weatherData.cod === '404') {
            return <p>{weatherData.message}</p>;
        } else if (weatherData) {
            const temperature = Math.round(weatherData.main.temp - 273.15); // Convert to Celsius
            const description = weatherData.weather[0].description;
            const iconCode = weatherData.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

            return (
                <div>
                    <p>{weatherData.name}</p>
                    <p>{description}</p>
                    <p>{temperature}°C</p>
                    <img src={iconUrl} alt={description} style={{ display: 'block' }} />
                </div>
            );
        }
    };

    const displayHourlyForecast = () => {
        if (hourlyData) {
            const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

            return next24Hours.map((item, index) => {
                const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
                const hour = dateTime.getHours();
                const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
                const iconCode = item.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

                return (
                    <div key={index} className="hourly-item">
                        <span>{hour}:00</span>
                        <img src={iconUrl} alt="Hourly Weather Icon" />
                        <span>{temperature}°C</span>
                    </div>
                );
            });
        }
    };

    return (
        <div className="App">
            <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Enter city"
            />
            <button onClick={getWeather}>Get Weather</button>
            <div id="weather-info">{displayWeather()}</div>
            <div id="hourly-forecast">{displayHourlyForecast()}</div>
        </div>
    );
}

export default App;
