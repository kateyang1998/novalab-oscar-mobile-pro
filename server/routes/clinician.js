// ─── server/routes/clinician.js ───────────────────────────────────────────────
import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();
const CURRENT_CLINICIAN_ID = 1; // Dr. Lee

// GET /api/clinician — current logged-in clinician
router.get('/', (req, res) => {
  const db = getDb();
  const clinician = db.prepare('SELECT * FROM Clinician WHERE clinicianId = ?').get(CURRENT_CLINICIAN_ID);
  if (!clinician) return res.status(404).json({ error: 'Clinician not found' });
  res.json({
    clinicianId: clinician.clinicianId,
    name:        clinician.name,
    role:        clinician.role,
    email:       clinician.email,
  });
});

// PUT /api/clinician/password — change password
router.put('/password', (req, res) => {
  const db = getDb();
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const auth = db.prepare('SELECT password FROM ClinicianAuth WHERE clinicianId = ?').get(CURRENT_CLINICIAN_ID);
  if (!auth || auth.password !== currentPassword) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  db.prepare('UPDATE ClinicianAuth SET password = ? WHERE clinicianId = ?').run(newPassword, CURRENT_CLINICIAN_ID);
  res.json({ success: true });
});

// POST /api/clinician/sync — record a sync event, return timestamp
router.post('/sync', (req, res) => {
  const syncedAt = new Date().toISOString();
  res.json({ success: true, syncedAt });
});

export default router;
