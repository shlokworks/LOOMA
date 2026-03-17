export default function ForecastCard({ list }) {
  if (!list || !list.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {list.slice(0, 6).map((f, index) => (
        <div
          key={index}
          className="bg-white/70 p-4 rounded-xl shadow-md text-center"
        >
          <p className="font-semibold">{f.dt_txt}</p>
          <p className="text-2xl">{Math.round(f.main.temp)}°C</p>
        </div>
      ))}
    </div>
  );
}
