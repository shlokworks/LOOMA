import { motion, AnimatePresence } from "framer-motion";

/**
 * Shows avatars of users currently in the same workspace.
 * Receives `users` array: [{ socketId, user: { name, colour } }]
 */
export default function OnlineUsers({ users = [] }) {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-1" title="Currently editing">
      <AnimatePresence>
        {users.slice(0, 5).map(({ socketId, user }) => (
          <motion.div
            key={socketId}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#0b0f1a] cursor-default"
              style={{ backgroundColor: user?.colour || "#3b82f6" }}
            >
              {(user?.name || "?")[0].toUpperCase()}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2436] border border-white/10 rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {user?.name || "Anonymous"}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {users.length > 5 && (
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-medium ring-2 ring-[#0b0f1a]">
          +{users.length - 5}
        </div>
      )}
      <span className="text-white/30 text-xs ml-1 hidden sm:inline">
        {users.length} online
      </span>
    </div>
  );
}
