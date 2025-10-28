import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center md:justify-end mt-4 space-x-2">

      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >

        <span className="block sm:hidden">«</span>
        <span className="hidden sm:block">Prev</span>
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 rounded border ${currentPage === i + 1
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        <span className="block sm:hidden">»</span>
        <span className="hidden sm:block">Next</span>
      </button>
    </div>
  );
}
