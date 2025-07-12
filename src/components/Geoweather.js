import React, { useState, useEffect } from 'react';

const GeoWeather = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error);

    function success(pos) {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });
    }

    function error(err) {
      console.error("Error getting location:", err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;
      const { latitude, longitude } = location;
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=b0a7bad410d5400c8c3145734251107&q=${latitude},${longitude}`
        );
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error("Failed to fetch weather:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [location]);

  if (loading) return <div>Loading weather...</div>;

  if (!weather) return <div>No weather data available.</div>;

  return (
    <div className="weather-card">
      <h2>Weather in {weather.location.name}, {weather.location.country}</h2>
      <p><strong>Temperature:</strong> {weather.current.temp_c} °C</p>
      <p><strong>Condition:</strong> {weather.current.condition.text}</p>
      <img src={weather.current.condition.icon} alt="weather icon" />
      <p><strong>Humidity:</strong> {weather.current.humidity}%</p>
      <p><strong>Wind Speed:</strong> {weather.current.wind_kph} km/h</p>
    </div>
  );
};

export default GeoWeather;
