// ─── server/routes/settings.js ────────────────────────────────────────────────
import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();
const CURRENT_CLINICIAN_ID = 1;

// GET /api/settings — get all settings for the current clinician
router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT settingKey, settingValue FROM ClinicianSettings WHERE clinicianId = ?').all(CURRENT_CLINICIAN_ID);

  const settings = {};
  rows.forEach(r => { settings[r.settingKey] = r.settingValue === '1'; });
  res.json(settings);
});

// PUT /api/settings — update one or more settings
// Body: { biometricLogin: true, autoLock: false, ... }
router.put('/', (req, res) => {
  const db   = getDb();
  const body = req.body;

  const stmt = db.prepare(`
    INSERT INTO ClinicianSettings (clinicianId, settingKey, settingValue)
    VALUES (?, ?, ?)
    ON CONFLICT(clinicianId, settingKey) DO UPDATE SET settingValue = excluded.settingValue
  `);

  for (const [key, value] of Object.entries(body)) {
    stmt.run(CURRENT_CLINICIAN_ID, key, value ? '1' : '0');
  }

  res.json({ success: true });
});

export default router;
