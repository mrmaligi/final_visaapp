'use client';

import React from 'react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  slots: TimeSlot[];
}

interface AvailabilityCalendarProps {
  schedule: DaySchedule[];
  selectedSlot?: { date: string; time: string } | null;
  onSelectSlot?: (date: string, time: string) => void;
  maxDays?: number;
}

export default function AvailabilityCalendar({
  schedule,
  selectedSlot,
  onSelectSlot,
  maxDays = 7,
}: AvailabilityCalendarProps): React.ReactElement {
  const visibleSchedule = schedule.slice(0, maxDays);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Select a Time</h3>

      <div className="space-y-4">
        {visibleSchedule.map((day) => (
          <div key={day.date} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-medium text-slate-900">{day.dayName}</span>
              <span className="text-sm text-slate-500">{day.date}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {day.slots.map((slot) => {
                const isSelected = selectedSlot?.date === day.date && selectedSlot?.time === slot.time;

                return (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => onSelectSlot?.(day.date, slot.time)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : slot.available
                        ? 'bg-gray-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {visibleSchedule.length === 0 && (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-500">No available slots</p>
        </div>
      )}
    </div>
  );
}
