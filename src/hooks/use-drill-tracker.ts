"use client";

import { useCallback, useSyncExternalStore } from "react";

const DRILL_LOG_EVENT = "tkd:drill-log-changed";
const EMPTY_LOG_SNAPSHOT = "[]";

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

function parseLogSnapshot(snapshot: string): string[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function readLogSnapshot(drillId: string): string {
  if (typeof window === "undefined") return EMPTY_LOG_SNAPSHOT;
  return localStorage.getItem(storageKey(drillId)) ?? EMPTY_LOG_SNAPSHOT;
}

function saveLog(drillId: string, log: string[]): void {
  try {
    localStorage.setItem(storageKey(drillId), JSON.stringify(log));
  } catch {
    // Quota exceeded or private browsing — silently skip.
  }
}

function emitLogChange(drillId: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<{ key: string }>(DRILL_LOG_EVENT, {
      detail: { key: storageKey(drillId) },
    }),
  );
}

function subscribeDrillLog(
  drillId: string,
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const key = storageKey(drillId);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === key) {
      onStoreChange();
    }
  };
  const handleCustom = (event: Event) => {
    const detail = (event as CustomEvent<{ key?: string }>).detail;
    if (!detail?.key || detail.key === key) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(DRILL_LOG_EVENT, handleCustom);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(DRILL_LOG_EVENT, handleCustom);
  };
}

function subscribeHydration(): () => void {
  return () => {};
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
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const logSnapshot = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => subscribeDrillLog(drillId, onStoreChange),
      [drillId],
    ),
    useCallback(() => readLogSnapshot(drillId), [drillId]),
    () => EMPTY_LOG_SNAPSHOT,
  );
  const log = parseLogSnapshot(logSnapshot);

  const markPracticed = useCallback(() => {
    const today = localDateStr();
    if (log.includes(today)) return;
    saveLog(drillId, [...log, today]);
    emitLogChange(drillId);
  }, [drillId, log]);

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
