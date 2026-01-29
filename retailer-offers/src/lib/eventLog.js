const EVENT_KEY = "vc_events_v1";

export function getEvents() {
  try {
    return JSON.parse(localStorage.getItem(EVENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function appendEvent(event) {
  const events = getEvents();
  events.push(event);
  localStorage.setItem(EVENT_KEY, JSON.stringify(events));
}