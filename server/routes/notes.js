// ─── server/routes/notes.js ───────────────────────────────────────────────────
import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();
const CURRENT_CLINICIAN_ID = 1;

// GET /api/notes/:noteId
router.get('/:noteId', (req, res) => {
  const db = getDb();
  const note = db.prepare(`
    SELECT cn.*, p.patientNumber
    FROM ClinicalNote cn
    JOIN Patient p ON cn.patientId = p.patientId
    WHERE cn.noteId = ?
  `).get(req.params.noteId);

  if (!note) return res.status(404).json({ error: 'Note not found' });

  res.json({
    noteId:               note.noteId,
    patientId:            note.patientNumber,
    chiefComplaint:       note.chiefComplaint,
    subjectiveDescription:note.subjectiveDescription,
    bloodPressure:        note.bloodPressure,
    heartRate:            note.heartRate,
    temperature:          note.temperature,
    weight:               note.weight,
    objectiveDescription: note.objectiveDescription,
    diagnosisCategory:    note.diagnosisCategory,
    clinicalAssessment:   note.clinicalAssessment,
    treatmentPlan:        note.treatmentPlan,
    medicationPrescribed: note.medicationPrescribed === 1,
    labTestOrdered:       note.labTestOrdered === 1,
    referralMade:         note.referralMade === 1,
    followUpRequired:     note.followUpRequired === 1,
    status:               note.status,
    noteType:             note.noteType,
  });
});

// POST /api/notes — create a new note
router.post('/', (req, res) => {
  const db = getDb();
  const body = req.body;

  const patient = db.prepare('SELECT patientId FROM Patient WHERE patientNumber = ?').get(body.patientId);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const result = db.prepare(`
    INSERT INTO ClinicalNote
      (patientId, clinicianId, chiefComplaint, subjectiveDescription,
       bloodPressure, heartRate, temperature, weight, objectiveDescription,
       diagnosisCategory, clinicalAssessment, treatmentPlan,
       medicationPrescribed, labTestOrdered, referralMade, followUpRequired,
       status, noteType)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Synced', 'SOAP Note')
  `).run(
    patient.patientId, CURRENT_CLINICIAN_ID,
    body.chiefComplaint       || null,
    body.subjectiveDescription|| null,
    body.bloodPressure        || null,
    body.heartRate            || null,
    body.temperature          || null,
    body.weight               || null,
    body.objectiveDescription || null,
    body.diagnosisCategory    || null,
    body.clinicalAssessment   || null,
    body.treatmentPlan        || null,
    body.medicationPrescribed ? 1 : 0,
    body.labTestOrdered       ? 1 : 0,
    body.referralMade         ? 1 : 0,
    body.followUpRequired     ? 1 : 0,
  );

  res.json({ success: true, noteId: result.lastInsertRowid });
});

// PUT /api/notes/:noteId — update an existing note
router.put('/:noteId', (req, res) => {
  const db = getDb();
  const body = req.body;

  db.prepare(`
    UPDATE ClinicalNote SET
      chiefComplaint        = ?,
      subjectiveDescription = ?,
      bloodPressure         = ?,
      heartRate             = ?,
      temperature           = ?,
      weight                = ?,
      objectiveDescription  = ?,
      diagnosisCategory     = ?,
      clinicalAssessment    = ?,
      treatmentPlan         = ?,
      medicationPrescribed  = ?,
      labTestOrdered        = ?,
      referralMade          = ?,
      followUpRequired      = ?,
      status                = 'Synced',
      updatedAt             = datetime('now')
    WHERE noteId = ?
  `).run(
    body.chiefComplaint       || null,
    body.subjectiveDescription|| null,
    body.bloodPressure        || null,
    body.heartRate            || null,
    body.temperature          || null,
    body.weight               || null,
    body.objectiveDescription || null,
    body.diagnosisCategory    || null,
    body.clinicalAssessment   || null,
    body.treatmentPlan        || null,
    body.medicationPrescribed ? 1 : 0,
    body.labTestOrdered       ? 1 : 0,
    body.referralMade         ? 1 : 0,
    body.followUpRequired     ? 1 : 0,
    req.params.noteId,
  );

  res.json({ success: true });
});

export default router;
