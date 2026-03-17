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

export default router;
