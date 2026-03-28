// ─── server/routes/appointments.js ────────────────────────────────────────────
import { Router } from 'express';
import { getDb } from '../db.js';
import { formatTimeHHMM, mapType, mapStatus, reverseMapType, reverseMapStatus, addMinutesToTime, parseDurationMinutes } from '../utils.js';

const router = Router();

const BASE_QUERY = `
  SELECT a.appointmentId, a.appointmentDate, a.startTime, a.endTime,
         a.reason, a.location,
         p.fullName    AS patientName,
         p.patientNumber AS patientId,
         apt.typeName,
         aps.statusName
  FROM Appointment a
  JOIN Patient           p   ON a.patientId  = p.patientId
  JOIN AppointmentType   apt ON a.typeId     = apt.typeId
  JOIN AppointmentStatus aps ON a.statusId   = aps.statusId
  WHERE a.clinicianId = 1
`;

function formatRow(a) {
  const startHHMM = formatTimeHHMM(a.startTime);
  const endHHMM   = formatTimeHHMM(a.endTime);
  // Compute duration in minutes
  const [sh, sm] = startHHMM.split(':').map(Number);
  const [eh, em] = endHHMM.split(':').map(Number);
  const diffMin  = (eh * 60 + em) - (sh * 60 + sm);
  const duration = diffMin > 0 ? `${diffMin} min` : '30 min';

  return {
    id:          a.appointmentId,
    patientName: a.patientName,
    patientId:   a.patientId,
    type:        mapType(a.typeName),
    date:        a.appointmentDate,
    startTime:   startHHMM,
    endTime:     endHHMM,
    duration,
    status:      mapStatus(a.statusName),
    reason:      a.reason,
    location:    a.location,
  };
}

// GET /api/appointments — all appointments for the schedule calendar
router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare(BASE_QUERY + ' ORDER BY a.appointmentDate, a.startTime').all();
  res.json(rows.map(formatRow));
});

// GET /api/appointments/today — today's appointments for the home screen
router.get('/today', (req, res) => {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const rows = db.prepare(BASE_QUERY + ' AND a.appointmentDate = ? ORDER BY a.startTime').all(today);
  res.json(rows.map(formatRow));
});

// PUT /api/appointments/:id — update an appointment
router.put('/:id', (req, res) => {
  const db   = getDb();
  const body = req.body;

  // Resolve typeId
  const dbTypeName = reverseMapType(body.type);
  const typeRow    = db.prepare('SELECT typeId FROM AppointmentType WHERE typeName = ?').get(dbTypeName);
  if (!typeRow) return res.status(400).json({ error: `Unknown appointment type: ${body.type}` });

  // Resolve statusId
  const dbStatusName = reverseMapStatus(body.status);
  const statusRow    = db.prepare('SELECT statusId FROM AppointmentStatus WHERE statusName = ?').get(dbStatusName);
  if (!statusRow) return res.status(400).json({ error: `Unknown status: ${body.status}` });

  // Compute endTime from startTime + duration
  const durationMin = parseDurationMinutes(body.duration);
  const endTime     = addMinutesToTime(body.startTime, durationMin);
  const startFull   = `${body.date} ${body.startTime}:00`;
  const endFull     = `${body.date} ${endTime}:00`;

  db.prepare(`
    UPDATE Appointment SET
      appointmentDate = ?,
      startTime       = ?,
      endTime         = ?,
      typeId          = ?,
      statusId        = ?,
      reason          = ?,
      updatedAt       = datetime('now')
    WHERE appointmentId = ?
  `).run(body.date, startFull, endFull, typeRow.typeId, statusRow.statusId, body.reason || null, req.params.id);

  res.json({ success: true });
});

// PATCH /api/appointments/:id/cancel — cancel an appointment
router.patch('/:id/cancel', (req, res) => {
  const db = getDb();
  const cancelledStatus = db.prepare("SELECT statusId FROM AppointmentStatus WHERE statusName = 'Cancelled'").get();
  if (!cancelledStatus) return res.status(500).json({ error: 'Cancelled status not found' });

  db.prepare(`
    UPDATE Appointment SET statusId = ?, updatedAt = datetime('now') WHERE appointmentId = ?
  `).run(cancelledStatus.statusId, req.params.id);

  res.json({ success: true });
});

export default router;
