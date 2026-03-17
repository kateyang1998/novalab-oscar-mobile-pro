// ─── server/utils.js ──────────────────────────────────────────────────────────
// Shared formatting utilities for API route handlers

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-02-09" or "2026-02-09 10:30:00" → "Feb 9, 2026" */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.substring(0, 10).split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** "2026-02-09 10:30:00" → "10:30" */
export function formatTimeHHMM(datetimeStr) {
  if (!datetimeStr) return '';
  const timePart = datetimeStr.includes(' ') ? datetimeStr.split(' ')[1] : datetimeStr;
  return timePart.substring(0, 5);
}

/** "2026-02-09 10:30:00" → "10:30 AM" */
export function formatTime12h(datetimeStr) {
  if (!datetimeStr) return '';
  const timePart = datetimeStr.includes(' ') ? datetimeStr.split(' ')[1] : datetimeStr;
  const [h, m] = timePart.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/** "1979-01-14" → 47 */
export function calcAge(dob) {
  if (!dob) return 0;
  const birth = new Date(dob.substring(0, 10) + 'T00:00:00');
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Map DB appointment type name → frontend type name (matches color map keys) */
export function mapType(dbType) {
  const map = {
    'Consultation': 'Consultation',
    'Follow-up': 'Follow Up',
    'Routine Check': 'Physical',
    'Emergency': 'Urgent Care',
  };
  return map[dbType] || dbType;
}

/** Map DB status name → frontend status name */
export function mapStatus(dbStatus) {
  const map = {
    'Booked': 'Scheduled',
    'Rescheduled': 'Scheduled',
    'Completed': 'Finished',
    'Cancelled': 'Cancelled',
  };
  return map[dbStatus] || dbStatus;
}
