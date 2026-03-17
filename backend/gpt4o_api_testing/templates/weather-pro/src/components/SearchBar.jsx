export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="flex gap-3 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-xl mx-auto mb-8">
      <input
        type="text"
        value={value}
        placeholder="Search city..."
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-2 rounded-xl outline-none bg-white shadow-inner"
      />
      <button
        onClick={onSearch}
        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
      >
        Search
      </button>
    </div>
  );
}
