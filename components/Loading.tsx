"use client"

import {useState, useEffect} from "react";
import { AnimatePresence, motion } from 'framer-motion';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "Waste no more time arguing what a good man should be. Be One.", author: "Marcus Aurelius" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius" },
  { text: "Be tolerant with others and strict with yourself.", author: "Marcus Aurelius" },
  { text: "You could leave life right now. Let that determine what you do and say and think.", author: "Marcus Aurelius" },
  { text: "We are more often frightened than hurt; and we suffer more in imagination than in reality.", author: "Seneca" },
  { text: "If a man knows not which port he sails, no wind is favorable.", author: "Seneca" },
  { text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca" },
  { text: "How does it help…to make troubles heavier by bemoaning them?", author: "Seneca" },
  { text: "Life is very short and anxious for those who forget the past, neglect the present, and fear the future.", author: "Seneca" },
  { text: "How long are you going to wait before you demand the best for yourself?", author: "Epictetus" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "Curb your desire—don’t set your heart on so many things and you will get what you need.", author: "Epictetus" },
  { text: "Don’t explain your philosophy. Embody it.", author: "Epictetus" },
  { text: "To make the best of what is in our power, and take the rest as it occurs.", author: "Epictetus" },
  { text: "Choose to die well while you can; wait too long, and it might become impossible to do so.", author: "Gaius Musonius Rufus" },
  { text: "From good people you’ll learn good, but if you mingle with the bad you’ll destroy such soul as you had.", author: "Gaius Musonius Rufus" },
  { text: "Since every man dies, it is better to die with distinction than to live long.", author: "Gaius Musonius Rufus" },
  { text: "In philosophy, rather than showing lots of complicated examples, seek a few clear ones.", author: "Gaius Musonius Rufus" },
  { text: "Live like a doctor, and constantly treat yourself with the medicine of reason.", author: "Gaius Musonius Rufus" },

];

export default function Loading() {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * quotes.length));

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((i) => Math.floor(Math.random() * quotes.length));
  }, 8000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="flex items-center justify-center w-full h-screen p-4 bg-[hsl(0_0%_98%)] overflow-hidden">
      <div className="flex flex-col items-center justify-between">
        <div className="relative w-[25rem] h-[20rem] bg-white rounded-2xl shadow-[0_0_24px_rgba(0,0,0,0.13)] flex flex-col items-center justify-center text-center p-4">
          <img
           src="/blockquote.png"
            alt=""
            className="
              absolute left-1/2 top-26
    w-24 h-24
    -translate-x-1/2 -translate-y-6 scale-90
    object-contain opacity-20
    pointer-events-none
            "
          />
          <AnimatePresence mode="wait">
  <motion.div
    key={currentIndex}
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative z-10 flex flex-col items-center justify-center text-center"
    style={{
                fontFamily: "Times New Roman, serif",
                minHeight: '8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
  >
    <span
      className="relative text-neutral-700 text-lg"
      style={{ fontFamily: "Times New Roman, serif" }}
    >
      {quotes[currentIndex].text}
    </span>
    <span
      className="relative mt-2 text-neutral-500"
      style={{ fontFamily: "Times New Roman, serif" }}
    >
      &ndash; {quotes[currentIndex].author}
    </span>
  </motion.div>
</AnimatePresence>

        </div>
        <div className="mt-16 animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}
