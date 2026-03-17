import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StickyCartButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <button className="px-4 py-3 rounded-full bg-blue-600 text-white shadow-lg">
          🛒 View Cart
        </button>
      </div>

      {/* mobile sticky */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-4 left-4 right-4 z-50 md:hidden mx-4 bg-blue-600 text-white py-3 rounded-full font-semibold shadow-lg"
          >
            🛒 Open Cart
          </motion.button>
        )}
      </AnimatePresence>

      {/* mock cart drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white border-t p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Your Cart</h3>
              <button onClick={() => setOpen(false)} className="text-gray-600">Close</button>
            </div>
            <div className="text-sm text-gray-600">Cart is empty (mock)</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
