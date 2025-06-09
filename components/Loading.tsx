import React from "react";

const quotes = [
  "Success is not final; failure is not fatal.",
  "Keep moving forward.",
  "Every moment is a fresh beginning.",
];

export default function Loading() {
  const quote = React.useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-64 h-64 bg-white rounded-lg flex items-center justify-center text-center p-4">
          <span className="absolute text-8xl opacity-10 select-none">`</span>
          <span className="relative z-10 text-gray-700">{quote}</span>
        </div>
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}
