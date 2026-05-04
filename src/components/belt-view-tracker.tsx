"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

export function BeltViewTracker({ belt }: { belt: string }) {
  useEffect(() => {
    analytics.beltViewed(belt);
  }, [belt]);
  return null;
}
