const API_KEY = "YOUR_API_KEY_HERE"; // User will replace this

export const fetchWeather = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    return await res.json();
  } catch (err) {
    console.error("Weather API error:", err);
    return null;
  }
};

export const fetchForecast = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    return await res.json();
  } catch (err) {
    console.error("Forecast API error:", err);
    return null;
  }
};
