import React from "react";

export default function Loader() {
  return (
    <div className="w-full flex justify-center py-10">
      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );
}
