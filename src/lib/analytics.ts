import posthog from 'posthog-js'

function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  posthog.capture(event, properties)
}

export const analytics = {
  beltViewed: (belt: string) => track('belt_viewed', { belt }),
  drillViewed: (drill: string, belt: string) => track('drill_viewed', { drill, belt }),
  drillPracticed: (drill: string, belt: string) => track('drill_practiced', { drill, belt }),
}
