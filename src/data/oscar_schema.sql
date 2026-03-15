-- ==========================================
-- OSCAR Mobile Database Schema
-- PostgreSQL
-- ==========================================


-- ==========================================
-- DROP TABLES (for reset)
-- ==========================================

DROP TABLE IF EXISTS VitalSigns CASCADE;
DROP TABLE IF EXISTS Medication CASCADE;
DROP TABLE IF EXISTS MedicalCondition CASCADE;
DROP TABLE IF EXISTS EmergencyContact CASCADE;
DROP TABLE IF EXISTS PatientAllergy CASCADE;
DROP TABLE IF EXISTS Message CASCADE;
DROP TABLE IF EXISTS MessageStatus CASCADE;
DROP TABLE IF EXISTS ClinicalNote CASCADE;
DROP TABLE IF EXISTS Appointment CASCADE;
DROP TABLE IF EXISTS AppointmentStatus CASCADE;
DROP TABLE IF EXISTS AppointmentType CASCADE;
DROP TABLE IF EXISTS Patient CASCADE;
DROP TABLE IF EXISTS Clinician CASCADE;


-- ==========================================
-- Clinician
-- ==========================================

CREATE TABLE Clinician (
    clinicianId SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);


-- ==========================================
-- Patient
-- ==========================================

CREATE TABLE Patient (
    patientId SERIAL PRIMARY KEY,
    patientNumber VARCHAR(20) UNIQUE NOT NULL, -- e.g., P-0021
    fullName VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    lastVisit DATE,
    createdAt TIMESTAMP DEFAULT NOW()
);


-- ==========================================
-- Patient Allergy
-- ==========================================

CREATE TABLE PatientAllergy (
    allergyId SERIAL PRIMARY KEY,
    patientId INTEGER NOT NULL,
    allergyName VARCHAR(100) NOT NULL,
    severity VARCHAR(20), -- Mild, Moderate, Severe

    CONSTRAINT fk_allergy_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
        ON DELETE CASCADE
);


-- ==========================================
-- Emergency Contact
-- ==========================================

CREATE TABLE EmergencyContact (
    contactId SERIAL PRIMARY KEY,
    patientId INTEGER NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50),
    phone VARCHAR(20),

    CONSTRAINT fk_emergency_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
        ON DELETE CASCADE
);


-- ==========================================
-- Medical Condition
-- ==========================================

CREATE TABLE MedicalCondition (
    conditionId SERIAL PRIMARY KEY,
    patientId INTEGER NOT NULL,
    conditionName VARCHAR(100) NOT NULL,
    diagnosedYear VARCHAR(4),
    notes TEXT,

    CONSTRAINT fk_condition_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
        ON DELETE CASCADE
);


-- ==========================================
-- Medication
-- ==========================================

CREATE TABLE Medication (
    medicationId SERIAL PRIMARY KEY,
    patientId INTEGER NOT NULL,
    medicationName VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    isActive BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_medication_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
        ON DELETE CASCADE
);


-- ==========================================
-- Vital Signs
-- ==========================================

CREATE TABLE VitalSigns (
    vitalId SERIAL PRIMARY KEY,
    patientId INTEGER NOT NULL,
    recordedDate TIMESTAMP NOT NULL,
    bloodPressure VARCHAR(20), -- e.g., 130/85
    heartRate INTEGER, -- bpm
    weight DECIMAL(5,2), -- kg
    temperature DECIMAL(4,2), -- celsius
    notes TEXT,
    clinicianId INTEGER,

    CONSTRAINT fk_vitals_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
        ON DELETE CASCADE,

    CONSTRAINT fk_vitals_clinician
        FOREIGN KEY (clinicianId)
        REFERENCES Clinician(clinicianId)
);


-- ==========================================
-- Appointment Type
-- ==========================================

CREATE TABLE AppointmentType (
    typeId SERIAL PRIMARY KEY,
    typeName VARCHAR(50) NOT NULL
);


-- ==========================================
-- Appointment Status
-- ==========================================

CREATE TABLE AppointmentStatus (
    statusId SERIAL PRIMARY KEY,
    statusName VARCHAR(50) NOT NULL
);


-- ==========================================
-- Appointment
-- ==========================================

CREATE TABLE Appointment (
    appointmentId SERIAL PRIMARY KEY,
    appointmentDate DATE NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    statusId INTEGER NOT NULL,
    typeId INTEGER NOT NULL,
    reason TEXT,
    location VARCHAR(100),
    patientId INTEGER NOT NULL,
    clinicianId INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_appointment_status
        FOREIGN KEY (statusId)
        REFERENCES AppointmentStatus(statusId),

    CONSTRAINT fk_appointment_type
        FOREIGN KEY (typeId)
        REFERENCES AppointmentType(typeId),

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
        ON DELETE CASCADE,

    CONSTRAINT fk_appointment_clinician
        FOREIGN KEY (clinicianId)
        REFERENCES Clinician(clinicianId)
);


-- ==========================================
-- Clinical Note (SOAP Format)
-- ==========================================

CREATE TABLE ClinicalNote (
    noteId SERIAL PRIMARY KEY,
    patientId INTEGER NOT NULL,
    clinicianId INTEGER NOT NULL,

    -- SOAP: Subjective
    chiefComplaint VARCHAR(200),
    subjectiveDescription TEXT,

    -- SOAP: Objective
    bloodPressure VARCHAR(20),
    heartRate VARCHAR(10),
    temperature VARCHAR(10),
    weight VARCHAR(10),
    objectiveDescription TEXT,

    -- SOAP: Assessment
    diagnosisCategory VARCHAR(100),
    clinicalAssessment TEXT,

    -- SOAP: Plan
    treatmentPlan TEXT,
    medicationPrescribed BOOLEAN DEFAULT FALSE,
    labTestOrdered BOOLEAN DEFAULT FALSE,
    referralMade BOOLEAN DEFAULT FALSE,
    followUpRequired BOOLEAN DEFAULT FALSE,

    -- Metadata
    status VARCHAR(20) DEFAULT 'Draft', -- Draft, Synced
    noteType VARCHAR(50) DEFAULT 'SOAP Note', -- SOAP Note, Progress Note, etc.
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_note_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
        ON DELETE CASCADE,

    CONSTRAINT fk_note_clinician
        FOREIGN KEY (clinicianId)
        REFERENCES Clinician(clinicianId)
);


-- ==========================================
-- Message Status
-- ==========================================

CREATE TABLE MessageStatus (
    statusId SERIAL PRIMARY KEY,
    statusName VARCHAR(50) NOT NULL
);


-- ==========================================
-- Message
-- ==========================================

CREATE TABLE Message (
    messageId SERIAL PRIMARY KEY,
    senderId INTEGER NOT NULL,
    receiverId INTEGER NOT NULL,
    subject VARCHAR(200),
    content TEXT NOT NULL,
    sentTime TIMESTAMP DEFAULT NOW(),
    statusId INTEGER NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_message_sender
        FOREIGN KEY (senderId)
        REFERENCES Clinician(clinicianId),

    CONSTRAINT fk_message_receiver
        FOREIGN KEY (receiverId)
        REFERENCES Clinician(clinicianId),

    CONSTRAINT fk_message_status
        FOREIGN KEY (statusId)
        REFERENCES MessageStatus(statusId)
);


-- ==========================================
-- SEED DATA
-- ==========================================

-- Appointment Types
INSERT INTO AppointmentType (typeName) VALUES
('Consultation'),
('Follow-up'),
('Routine Check'),
('Emergency');


-- Appointment Status
INSERT INTO AppointmentStatus (statusName) VALUES
('Booked'),
('Rescheduled'),
('Cancelled'),
('Completed');


-- Message Status
INSERT INTO MessageStatus (statusName) VALUES
('Sent'),
('Delivered'),
('Read');


-- ==========================================
-- INDEXES (Performance)
-- ==========================================

-- Patient indexes
CREATE INDEX idx_patient_number ON Patient(patientNumber);
CREATE INDEX idx_patient_name ON Patient(fullName);

-- Allergy indexes
CREATE INDEX idx_allergy_patient ON PatientAllergy(patientId);

-- Medical condition indexes
CREATE INDEX idx_condition_patient ON MedicalCondition(patientId);

-- Medication indexes
CREATE INDEX idx_medication_patient ON Medication(patientId);
CREATE INDEX idx_medication_active ON Medication(isActive);

-- Vital signs indexes
CREATE INDEX idx_vitals_patient ON VitalSigns(patientId);
CREATE INDEX idx_vitals_date ON VitalSigns(recordedDate);

-- Appointment indexes
CREATE INDEX idx_appointment_patient ON Appointment(patientId);
CREATE INDEX idx_appointment_clinician ON Appointment(clinicianId);
CREATE INDEX idx_appointment_date ON Appointment(appointmentDate);
CREATE INDEX idx_appointment_status ON Appointment(statusId);

-- Clinical note indexes
CREATE INDEX idx_note_patient ON ClinicalNote(patientId);
CREATE INDEX idx_note_clinician ON ClinicalNote(clinicianId);
CREATE INDEX idx_note_status ON ClinicalNote(status);
CREATE INDEX idx_note_created ON ClinicalNote(createdAt);

-- Message indexes
CREATE INDEX idx_message_sender ON Message(senderId);
CREATE INDEX idx_message_receiver ON Message(receiverId);
CREATE INDEX idx_message_status ON Message(statusId);
CREATE INDEX idx_message_read ON Message(isRead);


-- ==========================================
-- VIEWS (for easier querying)
-- ==========================================

-- View: Patient Summary with counts
CREATE OR REPLACE VIEW vw_PatientSummary AS
SELECT
    p.patientId,
    p.patientNumber,
    p.fullName,
    p.dob,
    p.gender,
    p.phone,
    p.email,
    p.lastVisit,
    EXTRACT(YEAR FROM AGE(p.dob)) AS age,
    COUNT(DISTINCT a.appointmentId) AS totalAppointments,
    COUNT(DISTINCT cn.noteId) AS totalNotes,
    COUNT(DISTINCT vs.vitalId) AS totalVitals
FROM Patient p
LEFT JOIN Appointment a ON p.patientId = a.patientId
LEFT JOIN ClinicalNote cn ON p.patientId = cn.patientId
LEFT JOIN VitalSigns vs ON p.patientId = vs.patientId
GROUP BY p.patientId;


-- ==========================================
-- SCHEMA READY
-- ==========================================
