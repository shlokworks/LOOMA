/**
 * websocketService
 * Simulates a live crypto feed by randomly adjusting prices.
 * In real apps, this would be:
 * wss://stream.binance.com/stream
 */

const websocketService = {
  start: (callback) => {
    // Emit updated prices at random intervals
    setInterval(() => {
      callback();
    }, 3000 + Math.random() * 2000); // 3–5 seconds
  }
};

export default websocketService;
