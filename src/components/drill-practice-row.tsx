"use client";

import { useCallback } from "react";
import { useDrillTracker } from "@/hooks/use-drill-tracker";
import { analytics } from "@/lib/analytics";

type Props = {
  drillId: string;
  beltId: string;
  name: string;
};

export function DrillPracticeRow({ drillId, beltId, name }: Props) {
  const { markPracticed, isPracticedToday, streak, last7Days, practicedDates, hydrated } =
    useDrillTracker(drillId);

  const handleMark = useCallback(() => {
    markPracticed();
    analytics.drillPracticed(name, beltId);
  }, [markPracticed, name, beltId]);

  // Render a stable-height placeholder before hydration to avoid layout shift.
  if (!hydrated) {
    return <div className="mt-3 h-8" aria-hidden />;
  }

  return (
    <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
      {/* 7-day practice dot calendar */}
      <div className="flex items-center gap-1" aria-label="Practice history for the last 7 days">
        {last7Days.map((date) => (
          <span
            key={date}
            role="img"
            aria-label={practicedDates.has(date) ? `Practiced on ${date}` : `No practice on ${date}`}
            className={`block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              practicedDates.has(date) ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        ))}
        {streak > 0 && (
          <span className="ml-1 text-xs font-semibold text-orange-500 tabular-nums">
            {streak}d streak
          </span>
        )}
      </div>

      {/* Mark practiced / already-done indicator */}
      {isPracticedToday ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Practiced today
        </span>
      ) : (
        <button
          type="button"
          onClick={handleMark}
          className="inline-flex items-center text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:text-gray-900 hover:border-gray-400 active:bg-gray-100 min-h-[32px] transition-colors touch-manipulation"
        >
          Mark practiced
        </button>
      )}
    </div>
  );
}
