// ─── src/components/schedule/AppointmentForm.jsx ─────────────────────────────

import { APPOINTMENT_TYPE_COLORS, APPOINTMENT_STATUS } from "../schedule/Scheduleutils.js";
import theme from '../../styles/theme';
import { TextInput, SelectInput, TextAreaInput } from '../common/FormControls';
import FormSection from '../common/FormSection';

const APPOINTMENT_TYPES = Object.keys(APPOINTMENT_TYPE_COLORS);
const STATUSES = Object.keys(APPOINTMENT_STATUS);
const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "90 min"];

// ── AppointmentForm ──────────────────────────────────────────────────────────

export default function AppointmentForm({ formData, onChange }) {

  return (
    <FormSection title="Appointment Details">
      {/* ── Type + Status ── */}
      <div style={styles.row}>
        <div style={styles.fieldHalf}>
          <label style={styles.label}>Appointment Type</label>
          <SelectInput value={formData.type} onChange={(e) => onChange('type', e.target.value)}>
            <option value="">Select Type</option>
            {APPOINTMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </SelectInput>
        </div>
        <div style={styles.fieldHalf}>
          <label style={styles.label}>Status</label>
          <SelectInput value={formData.status} onChange={(e) => onChange('status', e.target.value)}>
            <option value="">Select Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </SelectInput>
        </div>
      </div>

      {/* ── Date — single date input ── */}
      <div style={styles.field}>
        <label style={styles.label}>Date</label>
        <TextInput
          type="date"
          value={formData.date || ''}
          onChange={(e) => onChange('date', e.target.value)}
          style={{ padding: 10 }}
        />
      </div>

      {/* ── Time + Duration: single time input ── */}
      <div style={styles.row}>
        <div style={styles.fieldHalf}>
          <label style={styles.label}>Time</label>
          <TextInput
            type="time"
            value={formData.startTime || ''}
            onChange={(e) => onChange('startTime', e.target.value)}
            style={{ padding: 10 }}
          />
        </div>

        <div style={styles.fieldHalf}>
          <label style={styles.label}>Duration</label>
          <SelectInput value={formData.duration} onChange={(e) => onChange('duration', e.target.value)}>
            {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </SelectInput>
        </div>
      </div>

      {/* ── Reason for Visit ── */}
      <div style={styles.field}>
        <label style={styles.label}>Reason for Visit</label>
        <TextAreaInput
          value={formData.reasonForVisit}
          onChange={(e) => onChange('reasonForVisit', e.target.value)}
          placeholder="Reason for visit..."
          style={styles.textarea}
        />
      </div>
    </FormSection>
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