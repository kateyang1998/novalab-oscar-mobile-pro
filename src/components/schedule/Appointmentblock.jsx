// ─── src/components/schedule/AppointmentBlock.jsx ────────────────────────────
/**
 * Absolutely-positioned block rendered inside a timeline column.
 *
 * Props:
 *   appointment {object}   { id, patientName, type, startTime, endTime, status }
 *   top         {number}   px offset from top of timeline
 *   height      {number}   px height of the block
 *   compact     {boolean}  true = week view (less space), false = day view
 *   onClick     {function} (appointment) => void
 */

import { getTypeColors, formatTime12h, APPOINTMENT_STATUS } from "./Scheduleutils";
import theme from '../../styles/theme';
import { IconCheck, IconX, IconCircle } from '../common/Icons';

export default function AppointmentBlock({ appointment, top, height, compact = false, onClick, viewMode = undefined, slotWidth = undefined }) {
  const colors = getTypeColors(appointment.type);
  const isCancelled = appointment.status === "Cancelled";
  const statusCfg = APPOINTMENT_STATUS[appointment.status] ?? APPOINTMENT_STATUS["Scheduled"];

  const shortName = (() => {
    const parts = appointment.patientName.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}. ${parts[parts.length - 1]}`
      : appointment.patientName;
  })();

  // Determine rendering mode. `viewMode` when provided overrides `compact`.
  // Allowed: 'month', 'week', 'day'. If not passed, fall back to compact -> 'week' or else 'day'.
  const mode = viewMode
    ? viewMode
    : compact
    ? 'week'
    : 'day';

  // Slot width influences whether status is displayed on its own bottom row
  // or inlined next to the type. Parent can pass `slotWidth` (px). Fallback to 220.
  const widthForLayout = typeof slotWidth === 'number' ? slotWidth : 220;
  const STATUS_INLINE_THRESHOLD = 200; // if slot is narrower than this, inline the status

  const showType = height > 36; // same threshold as previous behavior
  const showStatusTall = height > 52;

  // Render month view: minimal, short name, color accent indicating type.
  if (mode === 'month') {
    return (
      <button
        onClick={() => onClick?.(appointment)}
        title={`${appointment.patientName} — ${appointment.type}`}
        style={{
          ...styles.block,
          ...styles.monthBlock,
          top,
          height,
          background: 'transparent',
          borderLeft: `6px solid ${colors.border}`,
        }}
      >
        <span style={{ ...styles.name, ...styles.monthName, color: colors.text }}>{shortName}</span>
      </button>
    );
  }

  // For week mode we keep the compact (short) rendering
  const effectiveCompact = mode === 'week' || compact;

  // Day mode (or default expanded view) — richer layout with top/bottom rows
  if (mode === 'day' || !effectiveCompact) {
    const inlineStatus = widthForLayout < STATUS_INLINE_THRESHOLD || !showStatusTall;

    return (
      <button
        onClick={() => onClick?.(appointment)}
        title={`${appointment.patientName} — ${appointment.type} @ ${formatTime12h(appointment.startTime)}${appointment.status ? ` — ${appointment.status}` : ''}`}
        style={{
          ...styles.block,
          ...styles.blockRow,
          top,
          height,
          background: isCancelled ? 'transparent' : colors.bg,
          borderLeft: isCancelled ? `3px dashed ${theme.colors.paleSky}` : `3px solid ${colors.border}`,
          opacity: isCancelled ? 0.6 : 1,
        }}
      >
        <div style={{ ...styles.dayContent }}>
          {/* Top row: left = name & type, right = time */}
          <div style={styles.dayTop}>
            <div style={styles.dayTopLeft}>
              <span style={{ ...styles.name, ...styles.nameRow, color: isCancelled ? theme.colors.paleSky : theme.colors.oscarBlack, fontSize: 12 }}>
                {appointment.patientName}
              </span>

              {(
                <span style={{ ...styles.type, ...styles.typePill, color: isCancelled ? theme.colors.paleSky : colors.text }}>
                  {appointment.type}
                </span>
              )}

              {/* If inlineStatus is true, show it next to the type */}
              {inlineStatus && !showType && (
                <span style={{ ...styles.status, ...styles.statusInline, color: statusCfg.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {appointment.status && appointment.status.toLowerCase() === 'finished' && (
                    <IconCheck size={12} color={statusCfg.color} />
                  )}
                  {appointment.status && appointment.status.toLowerCase() === 'cancelled' && (
                    <IconX size={12} color={statusCfg.color} />
                  )}
                  {appointment.status && appointment.status.toLowerCase() !== 'finished' && appointment.status.toLowerCase() !== 'cancelled' && (
                    <IconCircle size={10} color={statusCfg.color} />
                  )}
                  <span style={{ fontSize: 11 }}>{appointment.status}</span>
                </span>
              )}
            </div>

            {/* Time on the right */}
            <div style={styles.timeRight}>
              <span style={{ ...styles.time, color: isCancelled ? theme.colors.paleSky : colors.text }}>{formatTime12h(appointment.startTime)}</span>
            </div>
          </div>

          {/* Bottom row: status on the right when there is room */}
          {!inlineStatus && showStatusTall && (
            <div style={styles.dayBottom}>
              <span style={{ ...styles.status, color: statusCfg.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                {appointment.status && appointment.status.toLowerCase() === 'finished' && (
                  <IconCheck size={14} color={statusCfg.color} />
                )}
                {appointment.status && appointment.status.toLowerCase() === 'cancelled' && (
                  <IconX size={14} color={statusCfg.color} />
                )}
                {appointment.status && appointment.status.toLowerCase() !== 'finished' && appointment.status.toLowerCase() !== 'cancelled' && (
                  <IconCircle size={10} color={statusCfg.color} />
                )}

                <span>{appointment.status}</span>
              </span>
            </div>
          )}
        </div>
      </button>
    );
  }

  // Fallback: week / compact rendering (preserve original compact behaviour)
  return (
    <button
      onClick={() => onClick?.(appointment)}
      title={`${appointment.patientName} — ${appointment.type} @ ${formatTime12h(appointment.startTime)}`}
      style={{
        ...styles.block,
        top,
        height,
        background: isCancelled ? 'transparent' : colors.bg,
        borderLeft: isCancelled ? `3px dashed ${theme.colors.paleSky}` : `3px solid ${colors.border}`,
        opacity: isCancelled ? 0.6 : 1,
      }}
    >
      {/* Time — shown only in day view (compact hides it) */}
      {!effectiveCompact && (
        <span style={{ ...styles.time, color: isCancelled ? theme.colors.paleSky : colors.text }}>
          {formatTime12h(appointment.startTime)}
        </span>
      )}

      {/* Patient name */}
      <span style={{
        ...styles.name,
        color: isCancelled ? theme.colors.paleSky : theme.colors.oscarBlack,
        fontSize: effectiveCompact ? 9 : 12,
      }}>
        {effectiveCompact ? shortName : appointment.patientName}
      </span>

      {/* Appointment type — only if tall enough */}
      {showType && (
        <span style={{
          ...styles.type,
          color: isCancelled ? theme.colors.paleSky : colors.text,
          fontSize: effectiveCompact ? 8 : 10,
        }}>
          {appointment.type}
        </span>
      )}

      {/* Status dot — compact (week) view */}
      {effectiveCompact && height > 44 && (
        <span style={{ lineHeight: 1 }}>
          {appointment.status && appointment.status.toLowerCase() === 'finished' && (
            <IconCheck size={10} color={statusCfg.color} />
          )}
          {appointment.status && appointment.status.toLowerCase() === 'cancelled' && (
            <IconX size={10} color={statusCfg.color} />
          )}
          {appointment.status && appointment.status.toLowerCase() !== 'finished' && appointment.status.toLowerCase() !== 'cancelled' && (
            <IconCircle size={8} color={statusCfg.color} />
          )}
        </span>
      )}
    </button>
  );
}

const styles = {
  block: {
    position: "absolute",
    left: 2,
    right: 2,
    border: "none",
    borderRadius: 6,
    padding: "4px 6px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    overflow: "hidden",
    textAlign: "left",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    fontFamily: theme.font.family,
    gap: 1,
  },
  time: {
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 1.3,
  },
  name: {
    fontWeight: 700,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    width: "100%",
  },
  type: {
    opacity: 0.8,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    width: "100%",
  },
  status: {
    fontSize: 10,
    fontWeight: 500,
    marginTop: 2,
    lineHeight: 1,
  },
  // month variant
  monthBlock: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 6px',
    borderRadius: 6,
    gap: 6,
  },
  monthName: {
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  // day view styles
  dayContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  dayTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    gap: 8,
  },
  dayTopLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  timeRight: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    minWidth: 44,
  },
  dayBottom: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  typePill: {
    fontSize: 11,
    background: 'transparent',
    whiteSpace: 'nowrap',
  },
  statusInline: {
    marginLeft: 6,
    fontSize: 11,
  },
};