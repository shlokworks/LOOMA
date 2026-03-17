import React, { useEffect, useState } from "react";

export default function FlashSale() {
  // sale ends in 48 hours
  const target = Date.now() + 48 * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const t = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        clearInterval(t);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  return (
    <section className="my-12 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-2xl p-6 card-shadow">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold">Flash Sale — Limited Time</h3>
          <p className="mt-1 opacity-90">Up to 60% off on premium accessories. Hurry up!</p>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="bg-black/20 rounded-md px-4 py-2">
            <div className="text-xs">HRS</div>
            <div className="text-xl font-semibold">{timeLeft.hours || "--"}</div>
          </div>
          <div className="bg-black/20 rounded-md px-4 py-2">
            <div className="text-xs">MIN</div>
            <div className="text-xl font-semibold">{timeLeft.minutes || "--"}</div>
          </div>
          <div className="bg-black/20 rounded-md px-4 py-2">
            <div className="text-xs">SEC</div>
            <div className="text-xl font-semibold">{timeLeft.seconds || "--"}</div>
          </div>

          <button className="ml-4 px-5 py-2 bg-white text-gray-900 font-semibold rounded-md shadow">
            Shop Flash
          </button>
        </div>
      </div>
    </section>
  );
}
