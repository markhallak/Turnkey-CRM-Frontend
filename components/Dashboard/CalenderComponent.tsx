import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "@szhsin/react-menu/dist/index.css";
import { EventImpl } from "@fullcalendar/core/internal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { createPortal } from "react-dom";
import type { CalendarEvent } from "@/components/Header";

interface Props {
  events: CalendarEvent[];
}

const CalendarComponent = ({ events }: Props) => {
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek">(
    "dayGridMonth"
  );
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setDropDownIsOpen] = useState(false);
  const { open: sidebarOpen } = useSidebar();
  const [hoveredEvent, setHoveredEvent] = useState<EventImpl | null>(null);
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [fixedCoords, setFixedCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleDateChange = () => {
    if (calendarRef.current) {
      setCurrentDate(calendarRef.current.getApi().getDate());
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      calendarRef.current?.getApi()?.updateSize();
    }, 300);
    return () => clearTimeout(id);
  }, [sidebarOpen]);

  const handleViewChange = (newView: "dayGridMonth" | "timeGridWeek") => {
    setView(newView);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  const formattedTitle =
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate) +
    ", " +
    new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(currentDate);

  useEffect(() => {
    if (!hoveredEl) return;

    const handlePointerMove = (e: PointerEvent) => {
      // if the pointer is no longer over our event element, clear it
      if (!hoveredEl.contains(e.target as Node)) {
        setHoveredEvent(null);
        setHoveredEl(null);
      }
    };

    const handleScroll = () => {
      // any scroll = hide
      setHoveredEvent(null);
      setHoveredEl(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("wheel", handleScroll, true);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("wheel", handleScroll, true);
    };
  }, [hoveredEl]);

  return (
    <div className="w-full ml-0 pl-0 sm:ml-0 sm:pl-0 lg:pl-0 lg:ml-0">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <h2 className="text-xl title">{formattedTitle}</h2>

        <div className="mt-5 lg:mt-0 flex justify-between">
          <DropdownMenu open={isOpen} onOpenChange={setDropDownIsOpen}>
            <DropdownMenuTrigger
              className="flex items-start justify-center"
              asChild
            >
              <button className="text-sm flex items-center justify-between border shadow-sm bg-white px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-0 lg:ml-auto lg:min-w-[100px] w-full lg:w-fit">
                {view === "dayGridMonth" ? "Month" : "Week"}
                <ChevronDown size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto lg:min-w-[100px]">
              <DropdownMenuItem
                onClick={() => handleViewChange("dayGridMonth")}
              >
                Month
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleViewChange("timeGridWeek")}
              >
                Week
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Navigation */}
          <div className="flex items-center ml-5 space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => calendarRef.current?.getApi().prev()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => calendarRef.current?.getApi().next()}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>

      <FullCalendar
        windowResizeDelay={200}
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView={view}
        events={events}
        height="550px"
        headerToolbar={{
          left: "",
          center: "",
          right: "",
        }}
        datesSet={handleDateChange}
        eventMouseEnter={(info) => {
          const rect = info.el.getBoundingClientRect();
          setFixedCoords({ x: rect.left, y: rect.bottom + 8 });
          setHoveredEvent(info.event);
          setHoveredEl(info.el);
        }}
        eventMouseLeave={() => {
          setHoveredEvent(null);
          setFixedCoords(null);
          setHoveredEl(null);
        }}
      />

      {/* Popover for event details */}
      {hoveredEvent &&
        fixedCoords &&
        createPortal(
          <div
            className="
            fixed z-50
            bg-white shadow-md border border-gray-300
            rounded-lg p-3 text-sm w-64
          "
            style={{
              top: fixedCoords.y,
              left: fixedCoords.x,
            }}
          >
            <h3 className="font-bold text-lg">{hoveredEvent.title}</h3>
            <p className="text-gray-600">
              <strong>Start:</strong>{" "}
              {new Date(hoveredEvent.startStr).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <strong>End:</strong>{" "}
              {new Date(hoveredEvent.endStr).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <strong>Location:</strong>{" "}
              {hoveredEvent.extendedProps?.location || "N/A"}
            </p>
            <p className="text-gray-600">
              {hoveredEvent.extendedProps?.description ||
                "No description available"}
            </p>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CalendarComponent;
