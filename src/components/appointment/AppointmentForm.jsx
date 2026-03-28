// ─── src/components/schedule/AppointmentForm.jsx ─────────────────────────────

import { APPOINTMENT_TYPE_COLORS, APPOINTMENT_STATUS } from "../schedule/Scheduleutils.js";
import { TextInput, SelectInput, TextAreaInput, FormLabel } from '../common/FormControls';
import FormSection from '../common/FormSection';

const APPOINTMENT_TYPES = Object.keys(APPOINTMENT_TYPE_COLORS);
const STATUSES = Object.keys(APPOINTMENT_STATUS);
const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "90 min"];

// ── AppointmentForm ──────────────────────────────────────────────────────────

export default function AppointmentForm({ formData, onChange, errors = {} }) {

  return (
    <FormSection title="Appointment Details" style={{ marginBottom: 0 }}>
      {/* ── Type + Status ── */}
      <div style={styles.row}>
        <div style={styles.fieldHalf}>
          <FormLabel>Appointment Type</FormLabel>
          <SelectInput id="appt-type" value={formData.type} onChange={(e) => onChange('type', e.target.value)} error={errors.type}>
            <option value="">Select Type</option>
            {APPOINTMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </SelectInput>
        </div>
        <div style={styles.fieldHalf}>
          <FormLabel>Status</FormLabel>
          <SelectInput id="appt-status" value={formData.status} onChange={(e) => onChange('status', e.target.value)} error={errors.status}>
            <option value="">Select Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </SelectInput>
        </div>
      </div>

      {/* ── Date — single date input ── */}
      <div style={styles.field}>
        <FormLabel>Date</FormLabel>
        <TextInput
          id="appt-date"
          type="date"
          value={formData.date || ''}
          onChange={(e) => onChange('date', e.target.value)}
          style={{ padding: 10 }}
          error={errors.date}
        />
      </div>

      {/* ── Time + Duration: single time input ── */}
      <div style={styles.row}>
        <div style={styles.fieldHalf}>
          <FormLabel>Time</FormLabel>
          <TextInput
            id="appt-time"
            type="time"
            value={formData.startTime || ''}
            onChange={(e) => onChange('startTime', e.target.value)}
            style={{ padding: 10 }}
            error={errors.startTime}
          />
        </div>

        <div style={styles.fieldHalf}>
          <FormLabel>Duration</FormLabel>
          <SelectInput id="appt-duration" value={formData.duration} onChange={(e) => onChange('duration', e.target.value)} error={errors.duration}>
            {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </SelectInput>
        </div>
      </div>

      {/* ── Reason for Visit ── */}
      <div style={styles.field}>
        <FormLabel>Reason for Visit</FormLabel>
        <TextAreaInput
          id="appt-reason"
          value={formData.reasonForVisit}
          onChange={(e) => onChange('reasonForVisit', e.target.value)}
          placeholder="Reason for visit..."
          error={errors.reasonForVisit}
        />
      </div>
    </FormSection>
  );
}


// ── Styles (only keys used by this component) ───────────────────────────────
const styles = {
  row: {
    display: "flex",
    gap: 6,
    marginBottom: 8,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 8,
  },
  fieldHalf: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 8,
  },
};