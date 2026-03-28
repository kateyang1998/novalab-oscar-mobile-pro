// ─── server/db.js ─────────────────────────────────────────────────────────────
// SQLite database initialization and seeding.
// Auto-creates the schema and seeds test data on first run.

import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'oscar.db');

let db;

export function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA foreign_keys = ON");
    initDb(db);
  }
  return db;
}

function initDb(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS Clinician (
      clinicianId INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      role        TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      createdAt   TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Patient (
      patientId     INTEGER PRIMARY KEY AUTOINCREMENT,
      patientNumber TEXT UNIQUE NOT NULL,
      fullName      TEXT NOT NULL,
      dob           TEXT NOT NULL,
      gender        TEXT,
      phone         TEXT,
      email         TEXT,
      lastVisit     TEXT,
      createdAt     TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS PatientAllergy (
      allergyId   INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId   INTEGER NOT NULL,
      allergyName TEXT NOT NULL,
      severity    TEXT,
      FOREIGN KEY (patientId) REFERENCES Patient(patientId) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS EmergencyContact (
      contactId    INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId    INTEGER NOT NULL UNIQUE,
      name         TEXT NOT NULL,
      relationship TEXT,
      phone        TEXT,
      FOREIGN KEY (patientId) REFERENCES Patient(patientId) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MedicalCondition (
      conditionId   INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId     INTEGER NOT NULL,
      conditionName TEXT NOT NULL,
      diagnosedYear TEXT,
      notes         TEXT,
      FOREIGN KEY (patientId) REFERENCES Patient(patientId) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Medication (
      medicationId   INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId      INTEGER NOT NULL,
      medicationName TEXT NOT NULL,
      dosage         TEXT,
      frequency      TEXT,
      isActive       INTEGER DEFAULT 1,
      FOREIGN KEY (patientId) REFERENCES Patient(patientId) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS VitalSigns (
      vitalId       INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId     INTEGER NOT NULL,
      recordedDate  TEXT NOT NULL,
      bloodPressure TEXT,
      heartRate     INTEGER,
      weight        REAL,
      temperature   REAL,
      notes         TEXT,
      clinicianId   INTEGER,
      FOREIGN KEY (patientId)   REFERENCES Patient(patientId)   ON DELETE CASCADE,
      FOREIGN KEY (clinicianId) REFERENCES Clinician(clinicianId)
    );

    CREATE TABLE IF NOT EXISTS AppointmentType (
      typeId   INTEGER PRIMARY KEY AUTOINCREMENT,
      typeName TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS AppointmentStatus (
      statusId   INTEGER PRIMARY KEY AUTOINCREMENT,
      statusName TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Appointment (
      appointmentId   INTEGER PRIMARY KEY AUTOINCREMENT,
      appointmentDate TEXT NOT NULL,
      startTime       TEXT NOT NULL,
      endTime         TEXT NOT NULL,
      statusId        INTEGER NOT NULL,
      typeId          INTEGER NOT NULL,
      reason          TEXT,
      location        TEXT,
      patientId       INTEGER NOT NULL,
      clinicianId     INTEGER NOT NULL,
      createdAt       TEXT DEFAULT (datetime('now')),
      updatedAt       TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (statusId)    REFERENCES AppointmentStatus(statusId),
      FOREIGN KEY (typeId)      REFERENCES AppointmentType(typeId),
      FOREIGN KEY (patientId)   REFERENCES Patient(patientId) ON DELETE CASCADE,
      FOREIGN KEY (clinicianId) REFERENCES Clinician(clinicianId)
    );

    CREATE TABLE IF NOT EXISTS ClinicalNote (
      noteId                INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId             INTEGER NOT NULL,
      clinicianId           INTEGER NOT NULL,
      chiefComplaint        TEXT,
      subjectiveDescription TEXT,
      bloodPressure         TEXT,
      heartRate             TEXT,
      temperature           TEXT,
      weight                TEXT,
      objectiveDescription  TEXT,
      diagnosisCategory     TEXT,
      clinicalAssessment    TEXT,
      treatmentPlan         TEXT,
      medicationPrescribed  INTEGER DEFAULT 0,
      labTestOrdered        INTEGER DEFAULT 0,
      referralMade          INTEGER DEFAULT 0,
      followUpRequired      INTEGER DEFAULT 0,
      status                TEXT DEFAULT 'Draft',
      noteType              TEXT DEFAULT 'SOAP Note',
      createdAt             TEXT DEFAULT (datetime('now')),
      updatedAt             TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (patientId)   REFERENCES Patient(patientId) ON DELETE CASCADE,
      FOREIGN KEY (clinicianId) REFERENCES Clinician(clinicianId)
    );

    CREATE TABLE IF NOT EXISTS MessageStatus (
      statusId   INTEGER PRIMARY KEY AUTOINCREMENT,
      statusName TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Message (
      messageId  INTEGER PRIMARY KEY AUTOINCREMENT,
      senderId   INTEGER NOT NULL,
      receiverId INTEGER NOT NULL,
      subject    TEXT,
      content    TEXT NOT NULL,
      sentTime   TEXT DEFAULT (datetime('now')),
      statusId   INTEGER NOT NULL,
      isRead     INTEGER DEFAULT 0,
      FOREIGN KEY (senderId)   REFERENCES Clinician(clinicianId),
      FOREIGN KEY (receiverId) REFERENCES Clinician(clinicianId),
      FOREIGN KEY (statusId)   REFERENCES MessageStatus(statusId)
    );

    CREATE TABLE IF NOT EXISTS ClinicianAuth (
      clinicianId INTEGER PRIMARY KEY,
      password    TEXT NOT NULL DEFAULT 'oscar123',
      FOREIGN KEY (clinicianId) REFERENCES Clinician(clinicianId)
    );

    CREATE TABLE IF NOT EXISTS ClinicianSettings (
      clinicianId  INTEGER NOT NULL,
      settingKey   TEXT NOT NULL,
      settingValue TEXT NOT NULL DEFAULT '1',
      PRIMARY KEY (clinicianId, settingKey),
      FOREIGN KEY (clinicianId) REFERENCES Clinician(clinicianId)
    );
  `);

  // Seed static data only on first run
  const { count } = db.prepare('SELECT COUNT(*) as count FROM Clinician').get();
  if (count === 0) {
    seedData(db);
    console.log('Database seeded with test data.');
  } else {
    console.log('Database already populated, skipping static seed.');
    ensureTodayAppointments(db);
    ensureNewTableData(db);
  }
}

function seedData(db) {
  // Lookup tables
  db.exec(`
    INSERT INTO AppointmentType  (typeName)   VALUES ('Consultation'), ('Follow-up'), ('Routine Check'), ('Emergency');
    INSERT INTO AppointmentStatus(statusName) VALUES ('Booked'), ('Rescheduled'), ('Cancelled'), ('Completed');
    INSERT INTO MessageStatus    (statusName) VALUES ('Sent'), ('Delivered'), ('Read');

    INSERT INTO Clinician (name, role, email) VALUES
      ('Dr. Lee',        'Doctor', 'dr.lee@clinic.ca'),
      ('Dr. Smith',      'Doctor', 'dr.smith@clinic.ca'),
      ('Dr. Brown',      'Doctor', 'dr.brown@clinic.ca'),
      ('Nurse Johnson',  'Nurse',  'nurse.johnson@clinic.ca');

    INSERT INTO Patient (patientNumber, fullName, dob, gender, phone, email, lastVisit) VALUES
      ('P-0021', 'Sarah Johnson',     '1979-01-14', 'Female', '(555) 123-4567', 'sarah.j@email.com',     '2026-02-09'),
      ('P-0022', 'Michael Chen',      '1962-03-22', 'Male',   '(555) 234-5678', 'michael.c@email.com',   '2026-01-15'),
      ('P-0023', 'Emily Rodriguez',   '1990-07-08', 'Female', '(555) 345-6789', 'emily.r@email.com',     '2026-02-10'),
      ('P-0024', 'James Wilson',      '1996-11-30', 'Male',   '(555) 456-7890', 'james.w@email.com',     '2026-02-05'),
      ('P-0025', 'Maria Garcia',      '1973-04-17', 'Female', '(555) 567-8901', 'maria.g@email.com',     '2026-01-28'),
      ('P-0026', 'David Brown',       '1985-09-03', 'Male',   '(555) 678-9012', 'david.b@email.com',     '2026-02-12'),
      ('P-0027', 'Lisa Anderson',     '1977-12-11', 'Female', '(555) 789-0123', 'lisa.a@email.com',      '2026-02-01'),
      ('P-0028', 'Robert Taylor',     '1969-05-25', 'Male',   '(555) 890-1234', 'robert.t@email.com',    '2026-01-20'),
      ('P-0029', 'Jennifer Martinez', '1983-08-14', 'Female', '(555) 901-2345', 'jennifer.m@email.com',  '2026-02-07'),
      ('P-0030', 'William Thompson',  '1957-02-02', 'Male',   '(555) 012-3456', 'william.t@email.com',   '2026-01-25');

    INSERT INTO PatientAllergy (patientId, allergyName, severity) VALUES
      (1, 'Penicillin', 'Severe'), (1, 'Shellfish', 'Moderate'),
      (3, 'Peanuts', 'Severe'), (5, 'Latex', 'Mild'), (7, 'Aspirin', 'Moderate');

    INSERT INTO EmergencyContact (patientId, name, relationship, phone) VALUES
      (1,  'John Johnson',    'Spouse',   '(555) 987-6543'),
      (2,  'Linda Chen',      'Spouse',   '(555) 876-5432'),
      (3,  'Carlos Rodriguez','Father',   '(555) 765-4321'),
      (4,  'Mary Wilson',     'Mother',   '(555) 654-3210'),
      (5,  'Jose Garcia',     'Spouse',   '(555) 543-2109'),
      (6,  'Susan Brown',     'Sister',   '(555) 432-1098'),
      (7,  'Tom Anderson',    'Spouse',   '(555) 321-0987'),
      (8,  'Nancy Taylor',    'Daughter', '(555) 210-9876'),
      (9,  'Carlos Martinez', 'Spouse',   '(555) 109-8765'),
      (10, 'Betty Thompson',  'Spouse',   '(555) 098-7654');

    INSERT INTO MedicalCondition (patientId, conditionName, diagnosedYear, notes) VALUES
      (1,  'Hypertension',     '2020', 'Well controlled with medication'),
      (1,  'Type 2 Diabetes',  '2019', 'Managed with Metformin'),
      (2,  'Osteoarthritis',   '2018', 'Primarily affects knees'),
      (3,  'Asthma',           '2015', 'Mild, uses rescue inhaler as needed'),
      (5,  'High Cholesterol', '2021', 'On statin therapy'),
      (8,  'Type 2 Diabetes',  '2016', 'Diet controlled'),
      (10, 'COPD',             '2010', 'Former smoker, uses inhalers');

    INSERT INTO Medication (patientId, medicationName, dosage, frequency, isActive) VALUES
      (1,  'Metformin',     '500mg', 'Twice daily', 1),
      (1,  'Lisinopril',    '10mg',  'Once daily',  1),
      (2,  'Acetaminophen', '500mg', 'As needed',   1),
      (3,  'Albuterol',     '90mcg', 'As needed',   1),
      (5,  'Atorvastatin',  '20mg',  'Once daily',  1),
      (8,  'Glipizide',     '5mg',   'Once daily',  1),
      (10, 'Tiotropium',    '18mcg', 'Once daily',  1),
      (10, 'Albuterol',     '90mcg', 'As needed',   1);

    INSERT INTO VitalSigns (patientId, recordedDate, bloodPressure, heartRate, weight, temperature, clinicianId) VALUES
      (1, '2026-02-09 10:30:00', '130/85', 72, 68.00, 36.7, 1),
      (1, '2026-01-28 09:15:00', '128/82', 75, 69.00, 36.8, 1),
      (1, '2026-01-15 11:00:00', '132/88', 70, 67.00, 36.6, 1),
      (2, '2026-01-15 14:00:00', '135/90', 78, 82.00, 36.9, 1),
      (2, '2025-12-10 10:30:00', '140/92', 80, 83.50, 37.0, 1),
      (3, '2026-02-10 09:00:00', '118/75', 68, 62.00, 36.5, 2),
      (3, '2026-01-20 15:30:00', '120/78', 70, 62.50, 36.6, 2),
      (4, '2026-02-05 16:00:00', '122/80', 65, 75.00, 36.8, 2),
      (5, '2026-01-28 11:30:00', '145/95', 82, 70.00, 36.7, 1);

    INSERT INTO ClinicalNote
      (patientId, clinicianId, chiefComplaint, subjectiveDescription,
       bloodPressure, heartRate, temperature, weight, objectiveDescription,
       diagnosisCategory, clinicalAssessment, treatmentPlan,
       medicationPrescribed, labTestOrdered, referralMade, followUpRequired,
       status, noteType, createdAt)
    VALUES
      (1, 1, 'Diabetes Management',
       'Patient reports feeling dizzy occasionally. Also mentions increased thirst and frequent urination.',
       '130/85', '72', '36.7', '68',
       'Patient appears alert and oriented. No signs of acute distress. Fundoscopic exam normal.',
       'Type 2 Diabetes',
       'Blood sugar levels are within acceptable range but trending higher. Patient compliance with medication is good.',
       'Continue current medication regimen (Metformin 500mg twice daily). Monitor blood sugar daily. Schedule follow-up in 3 months.',
       1, 1, 0, 1, 'Synced', 'SOAP Note', '2026-02-09 10:30:00'),

      (2, 1, 'Hypertension',
       'Patient reports no new symptoms. Blood pressure has been stable at home monitoring.',
       '135/90', '78', '36.9', '82',
       'Blood pressure slightly elevated today. Patient is overweight. Cardiovascular exam otherwise normal.',
       'Hypertension',
       'Hypertension well controlled overall. Patient would benefit from weight loss and increased exercise.',
       'Continue current antihypertensive medication. Recommend 30 minutes of moderate exercise daily. Follow-up in 2 months.',
       0, 0, 0, 1, 'Synced', 'SOAP Note', '2026-01-15 14:00:00'),

      (3, 2, 'Routine Checkup',
       'No current complaints. Patient here for annual physical examination.',
       '118/75', '68', '36.5', '62',
       'General physical examination within normal limits. All systems reviewed and normal.',
       'Healthy',
       'Patient is in good health. No acute or chronic medical issues identified.',
       'Continue healthy lifestyle. No medications needed. Return for routine checkup in 1 year.',
       0, 1, 0, 0, 'Synced', 'SOAP Note', '2026-02-10 09:00:00'),

      (4, 2, 'Follow-up',
       'Patient seen for follow-up after minor injury.',
       '122/80', '65', '36.8', '75',
       'Wound healing well. No signs of infection.',
       'Minor Injury',
       'Wound care proceeding as expected.',
       'Continue current wound care. Return if signs of infection develop.',
       0, 0, 0, 0, 'Synced', 'Progress Note', '2026-02-05 16:00:00');

    INSERT INTO Message (senderId, receiverId, subject, content, sentTime, statusId, isRead) VALUES
      (3, 1, 'Consultation Note',
       'Patient seen for tachycardia. Recommend dosage adjustment. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
       '2026-02-15 10:30:00', 1, 0),
      (3, 1, 'Consultation Note',
       'Patient seen for tachycardia. Recommend dosage adjustment. Complete follow-up examination scheduled for next week.',
       '2026-02-15 10:30:00', 1, 0),
      (2, 1, 'Lab Results',
       'Patient seen for tachycardia. Recommend dosage adjustment. Blood pressure is stable.',
       '2026-02-14 10:30:00', 3, 1),
      (4, 1, 'Patient File Request',
       'Patient seen for tachycardia. Recommend dosage adjustment. Patient responded well to treatment.',
       '2026-02-13 10:30:00', 3, 1);

    INSERT INTO Appointment
      (appointmentDate, startTime, endTime, statusId, typeId, reason, location, patientId, clinicianId)
    VALUES
      ('2026-02-09', '2026-02-09 10:00:00', '2026-02-09 10:30:00', 4, 2, 'Routine follow-up visit', 'Room 101', 1, 1),
      ('2026-01-28', '2026-01-28 09:00:00', '2026-01-28 09:30:00', 4, 3, 'Blood pressure check',    'Room 102', 2, 2),
      ('2026-01-15', '2026-01-15 15:00:00', '2026-01-15 15:30:00', 4, 1, 'General consultation',   'Room 101', 2, 1);
  `);

  // Auth — default password oscar123 for all clinicians
  db.exec(`
    INSERT INTO ClinicianAuth (clinicianId, password) VALUES (1,'oscar123'),(2,'oscar123'),(3,'oscar123'),(4,'oscar123');
  `);

  // Default settings for Dr. Lee
  seedDefaultSettings(db, 1);

  ensureTodayAppointments(db);
}

function ensureTodayAppointments(db) {
  const today = new Date().toISOString().slice(0, 10);
  const { count } = db.prepare(
    'SELECT COUNT(*) as count FROM Appointment WHERE appointmentDate = ? AND clinicianId = 1'
  ).get(today);
  if (count > 0) return; // already have today's appointments

  console.log(`Inserting today's appointments for ${today}`);
  const insertAppt = db.prepare(`
    INSERT INTO Appointment (appointmentDate, startTime, endTime, statusId, typeId, reason, location, patientId, clinicianId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAppt.run(today, `${today} 09:00:00`, `${today} 09:30:00`, 1, 1, 'Diabetes management consultation', 'Room 101', 1, 1);
  insertAppt.run(today, `${today} 10:00:00`, `${today} 10:30:00`, 1, 2, 'Follow-up for blood pressure',      'Room 102', 2, 1);
  insertAppt.run(today, `${today} 11:00:00`, `${today} 11:30:00`, 1, 3, 'Annual physical examination',       'Room 103', 3, 2);
  insertAppt.run(today, `${today} 14:00:00`, `${today} 14:30:00`, 1, 2, 'Medication review',                 'Room 101', 5, 1);
}

// Called for existing DBs that were created before ClinicianAuth/ClinicianSettings were added
function ensureNewTableData(db) {
  // Ensure "New Patient" type exists
  db.prepare(`INSERT OR IGNORE INTO AppointmentType (typeName) VALUES ('New Patient')`).run();

  // Seed auth if table is empty
  const { authCount } = db.prepare('SELECT COUNT(*) as authCount FROM ClinicianAuth').get();
  if (authCount === 0) {
    const stmt = db.prepare('INSERT OR IGNORE INTO ClinicianAuth (clinicianId, password) VALUES (?, ?)');
    [1, 2, 3, 4].forEach(id => stmt.run(id, 'oscar123'));
  }

  // Seed default settings for clinician 1 if missing
  const { sc } = db.prepare('SELECT COUNT(*) as sc FROM ClinicianSettings WHERE clinicianId = 1').get();
  if (sc === 0) seedDefaultSettings(db, 1);
}

function seedDefaultSettings(db, clinicianId) {
  const stmt = db.prepare('INSERT OR IGNORE INTO ClinicianSettings (clinicianId, settingKey, settingValue) VALUES (?, ?, ?)');
  const defaults = { biometricLogin:'1', autoLock:'1', pushNotifications:'1', appointmentReminders:'1', autoSync:'1', offlineMode:'1' };
  for (const [key, val] of Object.entries(defaults)) stmt.run(clinicianId, key, val);
}
