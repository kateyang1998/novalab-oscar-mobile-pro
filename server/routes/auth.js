// ─── server/routes/auth.js ────────────────────────────────────────────────────
import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

// POST /api/auth/login
// Body: { userId, password }
// userId format: CL000001 (matches the display ID on Profile screen)
router.post('/login', (req, res) => {
  const db = getDb();
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'userId and password are required' });
  }

  // Parse clinicianId from userId like "CL000001" → 1
  const match = String(userId).match(/(\d+)$/);
  const clinicianId = match ? parseInt(match[1], 10) : null;

  if (!clinicianId) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const clinician = db.prepare('SELECT * FROM Clinician WHERE clinicianId = ?').get(clinicianId);
  const auth      = db.prepare('SELECT password FROM ClinicianAuth WHERE clinicianId = ?').get(clinicianId);

  if (!clinician || !auth || auth.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    success:     true,
    clinicianId: clinician.clinicianId,
    name:        clinician.name,
    role:        clinician.role,
    email:       clinician.email,
  });
});

// POST /api/auth/forgot-password
// Body: { userId }
// Resets the password back to the default "oscar123"
router.post('/forgot-password', (req, res) => {
  const db = getDb();
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const match = String(userId).match(/(\d+)$/);
  const clinicianId = match ? parseInt(match[1], 10) : null;

  if (!clinicianId) return res.status(404).json({ error: 'User ID not found' });

  const clinician = db.prepare('SELECT * FROM Clinician WHERE clinicianId = ?').get(clinicianId);
  if (!clinician) return res.status(404).json({ error: 'User ID not found' });

  db.prepare('UPDATE ClinicianAuth SET password = ? WHERE clinicianId = ?').run('oscar123', clinicianId);

  res.json({ success: true, message: 'Password has been reset to the default.' });
});

export default router;
