import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import Loader from "./components/Loader";
import { fetchWeather, fetchForecast } from "./utils/weatherApi";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);

    const w = await fetchWeather(city);
    const f = await fetchForecast(city);

    setWeather(w);
    setForecast(f.list || []);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10">
        Weather Pro Dashboard
      </h1>

      <SearchBar value={city} onChange={setCity} onSearch={searchWeather} />

      {loading && <Loader />}

      {!loading && weather && <WeatherCard data={weather} />}

      {!loading && forecast.length > 0 && <ForecastCard list={forecast} />}
    </div>
  );
}
