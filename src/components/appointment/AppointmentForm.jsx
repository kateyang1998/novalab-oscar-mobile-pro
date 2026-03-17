// ─── src/components/schedule/AppointmentForm.jsx ─────────────────────────────

import { APPOINTMENT_TYPE_COLORS, APPOINTMENT_STATUS } from "../schedule/Scheduleutils.js";
import theme from '../../styles/theme';
import { IconChevronDown } from '../common/Icons';

const APPOINTMENT_TYPES = Object.keys(APPOINTMENT_TYPE_COLORS);
const STATUSES = Object.keys(APPOINTMENT_STATUS);
const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "90 min"];

const MONTHS_LIST = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 10 }, (_, i) => 2024 + i);
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

// ── helpers ──────────────────────────────────────────────────────────────────

function parseDateStr(dateStr) {
  // dateStr = "YYYY-MM-DD"
  if (!dateStr) return { day: "1", month: "0", year: String(new Date().getFullYear()) };
  const [y, m, d] = dateStr.split("-");
  return { year: y, month: String(parseInt(m) - 1), day: String(parseInt(d)) };
}

function buildDateStr(year, month, day) {
  return `${year}-${String(parseInt(month) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseTimeStr(timeStr) {
  // timeStr = "HH:MM" 24h
  if (!timeStr) return { hour: "12", minute: "00", period: "PM" };
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return { hour: String(hour).padStart(2, "0"), minute: String(m).padStart(2, "0"), period };
}

function buildTimeStr(hour, minute, period) {
  let h = parseInt(hour);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

// ── AppointmentForm ──────────────────────────────────────────────────────────

export default function AppointmentForm({ formData, onChange, onAddNote, previousNotes = [] }) {
  const dateParts = parseDateStr(formData.date);
  const timeParts = parseTimeStr(formData.startTime);

  function handleDatePart(part, value) {
    const updated = { ...dateParts, [part]: value };
    onChange("date", buildDateStr(updated.year, updated.month, updated.day));
  }

  function handleTimePart(part, value) {
    const updated = { ...timeParts, [part]: value };
    onChange("startTime", buildTimeStr(updated.hour, updated.minute, updated.period));
  }

  return (
    <div style={styles.wrapper}>
      {/* ── Section heading ── */}
      <p style={styles.sectionTitle}>Appointment Details</p>
      <div style={styles.divider} />

      {/* ── Type + Status ── */}
      <div style={styles.row}>
        <div style={styles.fieldHalf}>
          <label style={styles.label}>Appointment Type</label>
          <Select
            value={formData.type}
            onChange={(v) => onChange("type", v)}
            placeholder="Select Type"
            options={APPOINTMENT_TYPES}
          />
        </div>
        <div style={styles.fieldHalf}>
          <label style={styles.label}>Status</label>
          <Select
            value={formData.status}
            onChange={(v) => onChange("status", v)}
            placeholder="Select Status"
            options={STATUSES}
          />
        </div>
      </div>

      {/* ── Date — 3 dropdowns ── */}
      <div style={styles.field}>
        <label style={styles.label}>Date</label>
        <div style={styles.row}>
          {/* Month */}
          <Select
            value={dateParts.month}
            onChange={(v) => handleDatePart("month", v)}
            options={MONTHS_LIST.map((m, i) => ({ label: m, value: String(i) }))}
            style={{ flex: 1.4 }}
          />
          {/* Day */}
          <Select
            value={dateParts.day}
            onChange={(v) => handleDatePart("day", v)}
            options={DAYS.map((d) => ({ label: String(d), value: String(d) }))}
            style={{ flex: 1 }}
          />
          {/* Year */}
          <Select
            value={dateParts.year}
            onChange={(v) => handleDatePart("year", v)}
            options={YEARS.map((y) => ({ label: String(y), value: String(y) }))}
            style={{ flex: 1.2 }}
          />
        </div>
      </div>

      {/* ── Time + Duration ── */}
      <div style={styles.row}>
        <div style={styles.fieldHalf}>
          <label style={styles.label}>Time</label>
          <div style={styles.row}>
            <Select
              value={timeParts.hour}
              onChange={(v) => handleTimePart("hour", v)}
              options={HOURS.map((h) => ({ label: h, value: h }))}
              style={{ flex: 1 }}
            />
            <Select
              value={timeParts.minute}
              onChange={(v) => handleTimePart("minute", v)}
              options={MINUTES.map((m) => ({ label: m, value: m }))}
              style={{ flex: 1 }}
            />
            <Select
              value={timeParts.period}
              onChange={(v) => handleTimePart("period", v)}
              options={PERIODS.map((p) => ({ label: p, value: p }))}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={styles.fieldHalf}>
          <label style={styles.label}>Duration</label>
          <Select
            value={formData.duration}
            onChange={(v) => onChange("duration", v)}
            options={DURATIONS}
          />
        </div>
      </div>

      {/* ── Reason for Visit ── */}
      <div style={styles.field}>
        <label style={styles.label}>Reason for Visit</label>
        <textarea
          value={formData.reasonForVisit}
          onChange={(e) => onChange("reasonForVisit", e.target.value)}
          placeholder="Reason for visit..."
          rows={4}
          style={styles.textarea}
        />
      </div>

      {/* ── Add Note ── */}
      <button onClick={onAddNote} style={styles.addNoteBtn}>
        + Add Note
      </button>

      {/* ── Previous notes ── */}
      {previousNotes.map((note, i) => (
        <div key={i} style={styles.noteCard}>
          <div style={styles.noteHeader}>
            <span style={styles.noteDate}>{note.date}</span>
            <span style={styles.noteDoctor}>{note.doctor}</span>
            <span style={styles.syncBadge}>Synced</span>
          </div>
          <p style={styles.noteType}>{note.type}</p>
          <p style={styles.noteText}>{note.text}</p>
        </div>
      ))}
    </div>
  );
}

// ── Reusable Select dropdown ─────────────────────────────────────────────────

function Select({ value, onChange, options, placeholder, style = {} }) {
  // options can be strings OR { label, value } objects
  const normalized = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );

  return (
    <div style={{ ...styles.selectWrapper, ...style }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <IconChevronDown style={styles.selectArrow} color={theme.colors.paleSky} />
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    background: theme.colors.oscarWhite,
    borderRadius: theme.radius.md,
    padding: 16,
    fontFamily: theme.font.family,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: theme.colors.oscarBlue,
    margin: 0,
  },
  divider: {
    height: 1,
    background: theme.colors.oscarBlue,
    marginTop: -10,
  },
  row: {
    display: "flex",
    gap: 8,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  fieldHalf: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.shark,
  },
  selectWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  select: {
    width: "100%",
    padding: "9px 28px 9px 10px",
    border: `1.5px solid ${theme.colors.oscarGray}`,
    borderRadius: 8,
    fontSize: 13,
    color: theme.colors.oscarBlack,
    background: theme.colors.oscarWhite,
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    outline: "none",
  },
  selectArrow: {
    position: "absolute",
    right: 8,
    pointerEvents: "none",
    display: 'flex',
    alignItems: 'center',
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: `1.5px solid ${theme.colors.oscarGray}`,
    borderRadius: 8,
    fontSize: 13,
    color: theme.colors.oscarBlack,
    resize: "none",
    boxSizing: "border-box",
    outline: "none",
  },
  addNoteBtn: {
    width: "100%",
    padding: "12px 0",
    border: `1.5px solid ${theme.colors.oscarGray}`,
    borderRadius: theme.radius.md,
    background: theme.colors.oscarWhite,
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.oscarBlack,
    cursor: "pointer",
  },
  noteCard: {
    background: theme.colors.oscarGray,
    borderRadius: theme.radius.md,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  noteHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  noteDate: {
    fontSize: 12,
    color: theme.colors.shark,
  },
  noteDoctor: {
    fontSize: 12,
    color: theme.colors.shark,
  },
  syncBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: theme.colors.oscarWhite,
    background: theme.colors.oscarGreen,
    borderRadius: 4,
    padding: "2px 6px",
  },
  noteType: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.oscarBlue,
    margin: 0,
  },
  noteText: {
    fontSize: 12,
    color: theme.colors.paleSky,
    margin: 0,
  },
};