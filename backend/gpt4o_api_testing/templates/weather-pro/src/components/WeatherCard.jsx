export default function WeatherCard({ data }) {
  if (!data || !data.weather) return null;

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-lg mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">{data.name}</h2>
      <p className="text-6xl mb-3">{Math.round(data.main.temp)}°C</p>
      <p className="text-xl capitalize">{data.weather[0].description}</p>
    </div>
  );
}
