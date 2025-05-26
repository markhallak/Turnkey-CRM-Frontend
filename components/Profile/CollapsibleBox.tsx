import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";

type Field = { label: string; answer: string };

interface CollapsibleBoxProps {
  title: string;
  fields: Field[];
}

const CollapsibleBox: React.FC<CollapsibleBoxProps> = ({ title, fields }) => {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [truncated, setTruncated] = useState(fields.map((f) => `${f.label}: ${f.answer}`).join("\n\n"));
  const [overflowing, setOverflowing] = useState(false);
  const [borderPos, setBorderPos] = useState({ top: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const measRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    setMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);



  const calculateTruncation = () => {
    if (!boxRef.current || !measRef.current) return;
    if (mobile) {
      setTruncated(fields.map((f) => `${f.label}: ${f.answer}`).join("\n\n"));
      setOverflowing(false);
      return;
    }
    const full = fields.map((f) => `${f.label}: ${f.answer}`).join("\n\n");
    const w = boxRef.current.clientWidth;
    const maxH = 300;
   Object.assign(measRef.current.style, {
      width: `${w}px`,
      padding: "1rem",
      lineHeight: "1.5",
      whiteSpace: "pre-wrap",
    });
    measRef.current.innerText = full;
   if (measRef.current.scrollHeight <= maxH) {
     setTruncated(full);
      setOverflowing(false);
   } else {
     setOverflowing(true);
      let lo = 0,
        hi = full.length,
        best = "";
      while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        const t = full.slice(0, mid).trimEnd() + "...";
        measRef.current.innerText = t;
        if (measRef.current.scrollHeight <= maxH) {
          best = t;
          lo = mid + 1;
       } else {
          hi = mid - 1;
        }
      }
      setTruncated(best);
    }
  };

  useLayoutEffect(calculateTruncation, [fields, mobile, open]);

  /*  👇  Watch the element itself for width/height changes (tab switch, resize, etc.) */
  useEffect(() => {
    if (!boxRef.current) return;
    const ro = new ResizeObserver(calculateTruncation);
    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current || !firstRef.current || !lastRef.current) return;
      const c = containerRef.current.getBoundingClientRect();
      const f = firstRef.current.getBoundingClientRect();
      const l = lastRef.current.getBoundingClientRect();
      const top = f.top - c.top;
      const bottom = l.bottom - c.top;
      setBorderPos({ top, height: bottom - top });
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    if (firstRef.current) ro.observe(firstRef.current);
    if (lastRef.current) ro.observe(lastRef.current);
    return () => ro.disconnect();
  }, [fields, mobile, open]);

  const show = mobile || open;
  const prevScrollY = useRef(0);

  const handleOpenChange = (next: boolean) => {
    if (!mobile) {
      if (next) {
        prevScrollY.current = window.scrollY;
        setOpen(true);
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      } else {
        setOpen(false);
        setTimeout(() => {
        window.scrollTo({ top: prevScrollY.current, behavior: "smooth" });
      }, 300);
      }
    } else {
      setOpen(next);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col min-h-0 scroll-mt-16">
      <style jsx global>{`
        .title { font-family: "Times New Roman", serif; text-transform: capitalize; color: #0b1f3a; }
        .label { font-family: "Times New Roman", serif; text-transform: uppercase; color: #0b1f3a; letter-spacing: 0.2em; font-size: 0.75rem !important; }
        .answer { color: #4b5563; }
      `}</style>
      <span className="title absolute -top-6 sm:-top-4 left-0 bg-white !text-xl sm:text-base sm:px-2 font-medium">{title}</span>
      {mobile && <div className="absolute left-1 w-[2px] bg-gray-300" style={{ top: borderPos.top, height: borderPos.height }} />}
      <Collapsible open={open} onOpenChange={handleOpenChange}>
        <div ref={boxRef} className={`w-full h-full flex flex-col overflow-hidden transition-[max-height] duration-300 ease-in-out ${show ? mobile? "": "max-h-[calc(100%-1rem)]" : "max-h-64 pb-0"} ${mobile ? "mb-4" : "border-t-2 border-gray-300"}`}>
          <div className="p-4 md:pl-2 pb-0 flex-1 overflow-hidden">
            {show
              ? fields.map((f, i) => (
                  <div key={i} ref={i === 0 ? firstRef : i === fields.length - 1 ? lastRef : undefined} className="whitespace-pre-wrap leading-relaxed">
                    <div className="label !text-xs">{f.label}</div>
                    <div className="answer mb-4">{f.answer}</div>
                  </div>
                ))
              : truncated.split(/\n\n/).map((line, i, arr) => {
                  const isLast = i === arr.length - 1;
                  const [lab, ...ansArr] = line.split(/:\s+/);
                  const ans = ansArr.join(": ");
                  return (
                    <div key={i} className="whitespace-pre-wrap leading-relaxed">
                      <div className="label">{lab}</div>
                      <div className={`answer ${isLast ? "mb-0" : "mb-4"}`}>{ans}</div>
                    </div>
                  );
                })}
          </div>
        </div>
        {!mobile && overflowing && (
          <CollapsibleTrigger asChild>
            <button className={`${open ? "mt-0" : "mt-2"} mx-auto flex items-center space-x-1 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-700`}>
              <span>{open ? "Show less" : "Show more"}</span>
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </CollapsibleTrigger>
        )}
      </Collapsible>
      <div ref={measRef} style={{ visibility: "hidden", position: "absolute", pointerEvents: "none" }} />
    </div>
 );
 };

export default CollapsibleBox;