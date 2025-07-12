import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather"; // ✅ Corrected named import
import NotificationPrompt from "./components/NotificationPrompt";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const data = await fetchWeather(`${latitude},${longitude}`);
            setWeatherData(data);
          } catch (error) {
            console.error("Geo fetch failed:", error);
          }
        },
        () => {
          console.warn("Geolocation not permitted.");
        }
      );
    }
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      const queue = JSON.parse(localStorage.getItem("weatherQueue")) || [];
      if (queue.length > 0) {
        alert("You're back online. Fetching queued searches...");
        for (let city of queue) {
          try {
            const data = await fetchWeather(city);
            setWeatherData(data);
            updateRecentSearches(data.location.name);
          } catch (err) {
            console.warn(`Failed to fetch queued city "${city}"`);
          }
        }
        localStorage.removeItem("weatherQueue");
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const fetchData = async (city) => {
    setError(null);

    if (!navigator.onLine) {
      const queue = JSON.parse(localStorage.getItem("weatherQueue")) || [];
      queue.push(city);
      localStorage.setItem("weatherQueue", JSON.stringify(queue));
      alert(`You are offline. "${city}" is queued and will sync later.`);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchWeather(city);
      setWeatherData(data);
      setCityName("");
      updateRecentSearches(data.location.name);
    } catch (error) {
      setError("City not found. Try again.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchData(cityName);
    }
  };

  const updateRecentSearches = (city) => {
    const updated = [city, ...recentSearches.filter((c) => c !== city)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleRecentSearch = (city) => {
    setCityName(city);
    fetchData(city);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const getTemperature = () => {
    if (!weatherData) return "";
    return isCelsius
      ? `${weatherData.current.temp_c} °C`
      : `${weatherData.current.temp_f} °F`;
  };

  return (
    <div>
      <div className="app">
        <h1>Weather App</h1>
        <NotificationPrompt />

        <div className="search">
          <input
            type="text"
            placeholder="Enter city name..."
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        <div className="unit-toggle">
          <span>°C</span>
          <label className="switch">
            <input type="checkbox" checked={!isCelsius} onChange={toggleTemperatureUnit} />
            <span className="slider round"></span>
          </label>
          <span>°F</span>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {weatherData && (
          <div className="weather-info">
            <h2>
              {weatherData.location.name}, {weatherData.location.region},{" "}
              {weatherData.location.country}
            </h2>
            <p>Temperature: {getTemperature()}</p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
            />
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Pressure: {weatherData.current.pressure_mb} mb</p>
            <p>Visibility: {weatherData.current.vis_km} km</p>
          </div>
        )}

        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <h3>Recent Searches</h3>
            <ul>
              {recentSearches.map((city, index) => (
                <li key={index} onClick={() => handleRecentSearch(city)}>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!navigator.onLine && (
          <div className="offline-queue">
            <h4>You're offline. Queued cities:</h4>
            <ul>
              {(JSON.parse(localStorage.getItem("weatherQueue")) || []).map((city, i) => (
                <li key={i}>{city}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
