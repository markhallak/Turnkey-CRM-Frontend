import React from "react";

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "Success is not final; failure is not fatal.", author: "Winston Churchill" },
  { text: "Keep moving forward.", author: "Walt Disney" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
];

export default function Loading() {
  const quote = React.useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-64 h-64 bg-white rounded-lg flex flex-col items-center justify-center text-center p-4">
          <img
            src="/blockquote.png"
            alt=""
            className="absolute inset-0 w-full h-full object-contain opacity-30"
          />
          <span className="relative z-10 text-gray-700" style={{ fontFamily: "Times New Roman, serif" }}>
            {quote.text}
          </span>
          <span
            className="relative z-10 mt-2 text-gray-500"
            style={{ fontFamily: "Times New Roman, serif" }}
          >
            {quote.author}
          </span>
        </div>
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}
