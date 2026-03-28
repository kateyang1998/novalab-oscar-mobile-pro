// ─── server/routes/patients.js ────────────────────────────────────────────────
import { Router } from 'express';
import { getDb } from '../db.js';
import { formatDate, calcAge, formatTime12h } from '../utils.js';

const router = Router();

// GET /api/patients
router.get('/', (req, res) => {
  const db = getDb();
  const patients = db.prepare(`
    SELECT patientId, patientNumber, fullName, dob, gender, phone, email, lastVisit
    FROM Patient
    ORDER BY lastVisit DESC
  `).all();

  res.json(patients.map(p => ({
    id: p.patientNumber,
    name: p.fullName,
    age: calcAge(p.dob),
    gender: p.gender,
    dob: formatDate(p.dob),
    lastVisit: formatDate(p.lastVisit),
    lastVisitDate: p.lastVisit ? p.lastVisit.substring(0, 10) : null,
    phone: p.phone,
    email: p.email,
  })));
});

// GET /api/patients/:patientNumber — full patient record
router.get('/:patientNumber', (req, res) => {
  const db = getDb();
  const patient = db.prepare(`
    SELECT patientId, patientNumber, fullName, dob, gender, phone, email, lastVisit
    FROM Patient WHERE patientNumber = ?
  `).get(req.params.patientNumber);

  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const allergies = db.prepare(
    'SELECT allergyName FROM PatientAllergy WHERE patientId = ?'
  ).all(patient.patientId);

  const emergency = db.prepare(
    'SELECT name, relationship, phone FROM EmergencyContact WHERE patientId = ?'
  ).get(patient.patientId);

  const conditions = db.prepare(
    'SELECT conditionName, diagnosedYear FROM MedicalCondition WHERE patientId = ?'
  ).all(patient.patientId);

  const medications = db.prepare(
    'SELECT medicationName, dosage, frequency FROM Medication WHERE patientId = ? AND isActive = 1'
  ).all(patient.patientId);

  const latestVitals = db.prepare(`
    SELECT bloodPressure, heartRate, weight, temperature
    FROM VitalSigns WHERE patientId = ?
    ORDER BY recordedDate DESC LIMIT 1
  `).get(patient.patientId);

  res.json({
    id: patient.patientNumber,
    name: patient.fullName,
    age: calcAge(patient.dob),
    gender: patient.gender,
    dob: formatDate(patient.dob),
    phone: patient.phone,
    email: patient.email,
    lastVisit: formatDate(patient.lastVisit),
    allergies: allergies.map(a => a.allergyName),
    emergencyContact: emergency
      ? { name: emergency.name, relationship: emergency.relationship, phone: emergency.phone }
      : null,
    medicalConditions: conditions.map(c => ({
      condition: c.conditionName,
      diagnosed: c.diagnosedYear,
    })),
    medications: medications.map(m => ({
      name: m.medicationName,
      dosage: m.dosage,
      frequency: m.frequency,
    })),
    vitals: latestVitals ? {
      bp:          { label: 'Blood Pressure', value: `${latestVitals.bloodPressure} mmHg` },
      hr:          { label: 'Heart Rate',     value: `${latestVitals.heartRate} bpm` },
      weight:      { label: 'Weight',         value: `${latestVitals.weight} kg` },
      temperature: { label: 'Temperature',    value: `${latestVitals.temperature}°C` },
    } : null,
  });
});

// GET /api/patients/:patientNumber/notes
router.get('/:patientNumber/notes', (req, res) => {
  const db = getDb();
  const patient = db.prepare('SELECT patientId FROM Patient WHERE patientNumber = ?').get(req.params.patientNumber);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const notes = db.prepare(`
    SELECT cn.noteId, cn.chiefComplaint, cn.status, cn.noteType, cn.createdAt,
           c.name AS clinicianName
    FROM ClinicalNote cn
    JOIN Clinician c ON cn.clinicianId = c.clinicianId
    WHERE cn.patientId = ?
    ORDER BY cn.createdAt DESC
  `).all(patient.patientId);

  res.json(notes.map(n => ({
    id: String(n.noteId),
    date: formatDate(n.createdAt),
    doctor: n.clinicianName,
    preview: n.chiefComplaint || 'Clinical Note',
    status: n.status,
    title: n.noteType,
  })));
});

// GET /api/patients/:patientNumber/vitals
router.get('/:patientNumber/vitals', (req, res) => {
  const db = getDb();
  const patient = db.prepare('SELECT patientId FROM Patient WHERE patientNumber = ?').get(req.params.patientNumber);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const vitals = db.prepare(`
    SELECT vitalId, recordedDate, bloodPressure, heartRate, weight, temperature
    FROM VitalSigns WHERE patientId = ?
    ORDER BY recordedDate DESC
  `).all(patient.patientId);

  res.json(vitals.map(v => ({
    id: String(v.vitalId),
    date: formatDate(v.recordedDate),
    bp:     v.bloodPressure || '—',
    hr:     v.heartRate != null ? String(v.heartRate) : '—',
    weight: v.weight      != null ? `${v.weight}kg`   : '—',
    temp:   v.temperature != null ? `${v.temperature}°C` : '—',
  })));
});

// GET /api/patients/:patientNumber/history
router.get('/:patientNumber/history', (req, res) => {
  const db = getDb();
  const patient = db.prepare('SELECT patientId FROM Patient WHERE patientNumber = ?').get(req.params.patientNumber);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const appointments = db.prepare(`
    SELECT a.appointmentId, a.appointmentDate, a.reason,
           c.name AS clinicianName, aps.statusName
    FROM Appointment a
    JOIN Clinician c        ON a.clinicianId = c.clinicianId
    JOIN AppointmentStatus aps ON a.statusId = aps.statusId
    WHERE a.patientId = ?
    ORDER BY a.appointmentDate DESC
  `).all(patient.patientId);

  res.json(appointments.map(a => ({
    id: String(a.appointmentId),
    date: formatDate(a.appointmentDate),
    visitType: a.reason || 'Visit',
    doctor: a.clinicianName,
  })));
});

export default router;
