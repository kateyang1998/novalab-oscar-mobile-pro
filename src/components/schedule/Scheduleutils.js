// ─── src/components/schedule/scheduleUtils.js ────────────────────────────────

export const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
export const DAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const HOUR_HEIGHT = 64;
export const START_HOUR = 8;
export const TIMELINE_HOURS = Array.from({ length: 10 }, (_, i) => i + START_HOUR);

// Add new appointment types here — color flows everywhere automatically
import theme from '../../styles/theme';

// Map human-readable appointment type names to theme tokens so the app
// uses only colors defined in `src/styles/theme.js`.
export const APPOINTMENT_TYPE_COLORS = {
  "New Patient": theme.colors.appointmentTypes.newPatient,
  "Follow Up": theme.colors.appointmentTypes.followUp,
  "Physical": theme.colors.appointmentTypes.physical,
  "Consultation": theme.colors.appointmentTypes.consultation,
  "Urgent Care": theme.colors.appointmentTypes.urgentCare,
  "Default": theme.colors.appointmentTypes.Default,
};

export const APPOINTMENT_STATUS = {
  Finished: { color: theme.colors.oscarGreen },
  Scheduled: { color: theme.colors.paleSky },
  Cancelled: { color: theme.colors.oscarRed },
};

export function toDateString(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime12h(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export function getWeekDates(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const dow = d.getDay();
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(d);
    nd.setDate(d.getDate() - dow + i);
    return nd.toISOString().slice(0, 10);
  });
}

export function getTodayString() {
  const t = new Date();
  return toDateString(t.getFullYear(), t.getMonth(), t.getDate());
}

export function getTypeColors(type) {
  return APPOINTMENT_TYPE_COLORS[type] ?? APPOINTMENT_TYPE_COLORS["Default"];
}

export function groupAppointmentsByDate(appointments) {
  return appointments.reduce((acc, a) => {
    if (!acc[a.date]) acc[a.date] = [];
    acc[a.date].push(a);
    return acc;
  }, {});
}

export function getTimelinePosition(startTime, endTime) {
  const startMin = parseTimeToMinutes(startTime);
  const endMin = parseTimeToMinutes(endTime);
  const top = (startMin - START_HOUR * 60) * (HOUR_HEIGHT / 60);
  const height = Math.max((endMin - startMin) * (HOUR_HEIGHT / 60), 32);
  return { top, height };
}