import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-3 mt-8">

      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 rounded-lg bg-[#1a1d23] border border-[#2a2d33] 
                   text-gray-300 disabled:opacity-40 hover:border-indigo-400 transition"
      >
        Prev
      </button>

      <span className="px-4 py-2 font-semibold text-gray-300">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 rounded-lg bg-[#1a1d23] border border-[#2a2d33] 
                   text-gray-300 disabled:opacity-40 hover:border-indigo-400 transition"
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;
