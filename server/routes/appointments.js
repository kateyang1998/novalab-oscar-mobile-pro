// ─── server/routes/appointments.js ────────────────────────────────────────────
import { Router } from 'express';
import { getDb } from '../db.js';
import { formatTimeHHMM, mapType, mapStatus } from '../utils.js';

const router = Router();

const BASE_QUERY = `
  SELECT a.appointmentId, a.appointmentDate, a.startTime, a.endTime,
         a.reason, a.location,
         p.fullName  AS patientName,
         apt.typeName,
         aps.statusName
  FROM Appointment a
  JOIN Patient           p   ON a.patientId  = p.patientId
  JOIN AppointmentType   apt ON a.typeId     = apt.typeId
  JOIN AppointmentStatus aps ON a.statusId   = aps.statusId
  WHERE a.clinicianId = 1
`;

function formatRow(a) {
  return {
    id:          a.appointmentId,
    patientName: a.patientName,
    type:        mapType(a.typeName),
    date:        a.appointmentDate,
    startTime:   formatTimeHHMM(a.startTime),
    endTime:     formatTimeHHMM(a.endTime),
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

export default router;
