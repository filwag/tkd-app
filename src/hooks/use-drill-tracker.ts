"use client";

import { useState, useEffect, useCallback } from "react";

// Returns YYYY-MM-DD in the device's local timezone.
// Using getFullYear/Month/Date avoids the UTC-vs-local trap that
// `toISOString()` has (it always returns UTC).
function localDateStr(d: Date = new Date()): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

// Goes back one calendar day in local time, safely handling DST by
// anchoring at noon before subtracting.
function prevLocalDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() - 1);
  return localDateStr(d);
}

function storageKey(drillId: string): string {
  return `tkd:drill:${drillId}:log`;
}

function loadLog(drillId: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey(drillId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function saveLog(drillId: string, log: string[]): void {
  try {
    localStorage.setItem(storageKey(drillId), JSON.stringify(log));
  } catch {
    // Quota exceeded or private browsing — silently skip.
  }
}

// Streak = consecutive calendar days (device TZ) up through today that
// have at least one practice entry.
//
// Assumption: device local timezone (documented in TKD-6 spec).
// The streak does NOT break if you haven't practiced yet today — it
// only breaks when yesterday also has no entry.
function calcStreak(log: string[]): number {
  if (!log.length) return 0;
  const set = new Set(log);
  const today = localDateStr();
  // Start from today if practiced; otherwise from yesterday (grace period
  // so students who haven't practiced yet today don't see a broken streak).
  let cursor = set.has(today) ? today : prevLocalDate(today);
  if (!set.has(cursor)) return 0;
  let count = 0;
  while (set.has(cursor)) {
    count++;
    cursor = prevLocalDate(cursor);
  }
  return count;
}

// Returns an array of the last 7 local-timezone date strings, oldest first.
function last7DayStrings(): string[] {
  const result: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(localDateStr(d));
  }
  return result;
}

export type DrillTrackerState = {
  markPracticed: () => void;
  isPracticedToday: boolean;
  streak: number;
  last7Days: string[];
  practicedDates: Set<string>;
  hydrated: boolean;
};

export function useDrillTracker(drillId: string): DrillTrackerState {
  const [log, setLog] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLog(loadLog(drillId));
    setHydrated(true);
  }, [drillId]);

  const markPracticed = useCallback(() => {
    const today = localDateStr();
    setLog((prev) => {
      if (prev.includes(today)) return prev;
      const next = [...prev, today];
      saveLog(drillId, next);
      return next;
    });
  }, [drillId]);

  const practicedDates = new Set(log);
  const today = localDateStr();

  return {
    markPracticed,
    isPracticedToday: hydrated && practicedDates.has(today),
    streak: hydrated ? calcStreak(log) : 0,
    last7Days: last7DayStrings(),
    practicedDates,
    hydrated,
  };
}
