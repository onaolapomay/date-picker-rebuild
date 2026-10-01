import { useState, useRef, useEffect } from 'react';

export default function Calendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [focusedDay, setFocusedDay] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const dayButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setFocusedDay(1);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setFocusedDay(1);
  };

  const handleDateClick = (dayNum: number) => {
    const newSelected = new Date(year, month, dayNum);
    setSelectedDate(newSelected);
    setFocusedDay(dayNum);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
  };

  const isSelected = (dayNum: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === dayNum &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, dayNum: number) => {
    let nextDay = dayNum;

    if (e.key === 'ArrowRight') {
      nextDay = Math.min(dayNum + 1, totalDays);
    } else if (e.key === 'ArrowLeft') {
      nextDay = Math.max(dayNum - 1, 1);
    } else if (e.key === 'ArrowDown') {
      nextDay = Math.min(dayNum + 7, totalDays);
    } else if (e.key === 'ArrowUp') {
      nextDay = Math.max(dayNum - 7, 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDateClick(dayNum);
      return;
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    } else {
      return;
    }

    e.preventDefault();
    setFocusedDay(nextDay);
    dayButtonRefs.current[nextDay]?.focus();
  };

  const formatDateString = (date: Date | null) => {
    if (!date) return "Select a date...";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative max-w-sm mx-auto mt-10" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date Picker
      </label>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm text-sm text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-left"
          aria-expanded={isOpen}
        >
          <span className={selectedDate ? "text-gray-900 font-medium" : "text-gray-400"}>
            {formatDateString(selectedDate)}
          </span>
        </button>

        <div className="absolute right-3 flex items-center gap-2">
          {selectedDate && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-gray-600 p-1"
              title="Clear selection"
            >
              ✕
            </button>
          )}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform pointer-events-none ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full p-5 bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              {monthNames[month]} {year}
            </h2>
            <div className="flex gap-1">
              <button 
                type="button"
                onClick={prevMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                aria-label="Previous month"
              >
                &larr;
              </button>
              <button 
                type="button"
                onClick={nextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                aria-label="Next month"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-xs font-medium text-gray-400">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex }).map((_, index) => (
              <div key={`empty-${index}`} className="h-9 w-9" />
            ))}

            {Array.from({ length: totalDays }).map((_, index) => {
              const dayNum = index + 1;
              const selected = isSelected(dayNum);
              const isFocused = focusedDay === dayNum;

              return (
                <button
                  type="button"
                  key={dayNum}
                  ref={(el: HTMLButtonElement | null) => {
                    dayButtonRefs.current[dayNum] = el;
                  }}
                  tabIndex={isFocused ? 0 : -1}
                  onClick={() => handleDateClick(dayNum)}
                  onKeyDown={(e) => handleKeyDown(e, dayNum)}
                  className={`h-9 w-9 mx-auto flex items-center justify-center rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    selected
                      ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-200"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}