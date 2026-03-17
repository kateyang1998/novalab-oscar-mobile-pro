-- =========================================
-- Test Data
-- =========================================


-- ==========================================
-- CLINICIANS
-- ==========================================

INSERT INTO Clinician (name, role, email) VALUES
('Dr. Lee', 'Doctor', 'dr.lee@clinic.ca'),
('Dr. Smith', 'Doctor', 'dr.smith@clinic.ca'),
('Dr. Brown', 'Doctor', 'dr.brown@clinic.ca'),
('Nurse Johnson', 'Nurse', 'nurse.johnson@clinic.ca');


-- ==========================================
-- PATIENTS
-- ==========================================

INSERT INTO Patient (patientNumber, fullName, dob, gender, phone, email, lastVisit) VALUES
('P-0021', 'Sarah Johnson', '1979-01-14', 'Female', '(555) 123-4567', 'sarah.j@email.com', '2026-02-09'),
('P-0022', 'Michael Chen', '1962-03-22', 'Male', '(555) 234-5678', 'michael.c@email.com', '2026-01-15'),
('P-0023', 'Emily Rodriguez', '1990-07-08', 'Female', '(555) 345-6789', 'emily.r@email.com', '2026-02-10'),
('P-0024', 'James Wilson', '1996-11-30', 'Male', '(555) 456-7890', 'james.w@email.com', '2026-02-05'),
('P-0025', 'Maria Garcia', '1973-04-17', 'Female', '(555) 567-8901', 'maria.g@email.com', '2026-01-28'),
('P-0026', 'David Brown', '1985-09-03', 'Male', '(555) 678-9012', 'david.b@email.com', '2026-02-12'),
('P-0027', 'Lisa Anderson', '1977-12-11', 'Female', '(555) 789-0123', 'lisa.a@email.com', '2026-02-01'),
('P-0028', 'Robert Taylor', '1969-05-25', 'Male', '(555) 890-1234', 'robert.t@email.com', '2026-01-20'),
('P-0029', 'Jennifer Martinez', '1983-08-14', 'Female', '(555) 901-2345', 'jennifer.m@email.com', '2026-02-07'),
('P-0030', 'William Thompson', '1957-02-02', 'Male', '(555) 012-3456', 'william.t@email.com', '2026-01-25');


-- ==========================================
-- PATIENT ALLERGIES
-- ==========================================

INSERT INTO PatientAllergy (patientId, allergyName, severity) VALUES
(1, 'Penicillin', 'Severe'),
(1, 'Shellfish', 'Moderate'),
(3, 'Peanuts', 'Severe'),
(5, 'Latex', 'Mild'),
(7, 'Aspirin', 'Moderate');


-- ==========================================
-- EMERGENCY CONTACTS
-- ==========================================

INSERT INTO EmergencyContact (patientId, name, relationship, phone) VALUES
(1, 'John Johnson', 'Spouse', '(555) 987-6543'),
(2, 'Linda Chen', 'Spouse', '(555) 876-5432'),
(3, 'Carlos Rodriguez', 'Father', '(555) 765-4321'),
(4, 'Mary Wilson', 'Mother', '(555) 654-3210'),
(5, 'Jose Garcia', 'Spouse', '(555) 543-2109'),
(6, 'Susan Brown', 'Sister', '(555) 432-1098'),
(7, 'Tom Anderson', 'Spouse', '(555) 321-0987'),
(8, 'Nancy Taylor', 'Daughter', '(555) 210-9876'),
(9, 'Carlos Martinez', 'Spouse', '(555) 109-8765'),
(10, 'Betty Thompson', 'Spouse', '(555) 098-7654');


-- ==========================================
-- MEDICAL CONDITIONS
-- ==========================================

INSERT INTO MedicalCondition (patientId, conditionName, diagnosedYear, notes) VALUES
(1, 'Hypertension', '2020', 'Well controlled with medication'),
(1, 'Type 2 Diabetes', '2019', 'Managed with Metformin'),
(2, 'Osteoarthritis', '2018', 'Primarily affects knees'),
(3, 'Asthma', '2015', 'Mild, uses rescue inhaler as needed'),
(5, 'High Cholesterol', '2021', 'On statin therapy'),
(8, 'Type 2 Diabetes', '2016', 'Diet controlled'),
(10, 'COPD', '2010', 'Former smoker, uses inhalers');


-- ==========================================
-- MEDICATIONS
-- ==========================================

INSERT INTO Medication (patientId, medicationName, dosage, frequency, isActive) VALUES
(1, 'Metformin', '500mg', 'Twice daily', TRUE),
(1, 'Lisinopril', '10mg', 'Once daily', TRUE),
(2, 'Acetaminophen', '500mg', 'As needed', TRUE),
(3, 'Albuterol', '90mcg', 'As needed', TRUE),
(5, 'Atorvastatin', '20mg', 'Once daily', TRUE),
(8, 'Glipizide', '5mg', 'Once daily', TRUE),
(10, 'Tiotropium', '18mcg', 'Once daily', TRUE),
(10, 'Albuterol', '90mcg', 'As needed', TRUE);


-- ==========================================
-- VITAL SIGNS
-- ==========================================

INSERT INTO VitalSigns (patientId, recordedDate, bloodPressure, heartRate, weight, temperature, clinicianId) VALUES
-- Sarah Johnson (P-0021)
(1, '2026-02-09 10:30:00', '130/85', 72, 68.00, 36.7, 1),
(1, '2026-01-28 09:15:00', '128/82', 75, 69.00, 36.8, 1),
(1, '2026-01-15 11:00:00', '132/88', 70, 67.00, 36.6, 1),

-- Michael Chen (P-0022)
(2, '2026-01-15 14:00:00', '135/90', 78, 82.00, 36.9, 1),
(2, '2025-12-10 10:30:00', '140/92', 80, 83.50, 37.0, 1),

-- Emily Rodriguez (P-0023)
(3, '2026-02-10 09:00:00', '118/75', 68, 62.00, 36.5, 2),
(3, '2026-01-20 15:30:00', '120/78', 70, 62.50, 36.6, 2),

-- James Wilson (P-0024)
(4, '2026-02-05 16:00:00', '122/80', 65, 75.00, 36.8, 2),

-- Maria Garcia (P-0025)
(5, '2026-01-28 11:30:00', '145/95', 82, 70.00, 36.7, 1);


-- ==========================================
-- APPOINTMENTS
-- ==========================================

INSERT INTO Appointment
(appointmentDate, startTime, endTime, statusId, typeId, reason, location, patientId, clinicianId)
VALUES
-- Upcoming appointments
('2026-03-20', '2026-03-20 09:00:00', '2026-03-20 09:30:00', 1, 1, 'Diabetes management consultation', 'Room 101', 1, 1),
('2026-03-20', '2026-03-20 10:00:00', '2026-03-20 10:30:00', 1, 2, 'Follow-up for blood pressure', 'Room 102', 2, 1),
('2026-03-21', '2026-03-21 11:00:00', '2026-03-21 11:30:00', 1, 3, 'Annual physical examination', 'Room 103', 3, 2),
('2026-03-21', '2026-03-21 14:00:00', '2026-03-21 14:30:00', 1, 2, 'Medication review', 'Room 101', 5, 1),

-- Past appointments
('2026-02-09', '2026-02-09 10:00:00', '2026-02-09 10:30:00', 4, 2, 'Routine follow-up visit', 'Room 101', 1, 1),
('2026-01-28', '2026-01-28 09:00:00', '2026-01-28 09:30:00', 4, 3, 'Blood pressure check', 'Room 102', 2, 2),
('2026-01-15', '2026-01-15 15:00:00', '2026-01-15 15:30:00', 4, 1, 'General consultation', 'Room 101', 2, 1);


-- ==========================================
-- CLINICAL NOTES (SOAP Format)
-- ==========================================

INSERT INTO ClinicalNote
(patientId, clinicianId, chiefComplaint, subjectiveDescription,
 bloodPressure, heartRate, temperature, weight, objectiveDescription,
 diagnosisCategory, clinicalAssessment, treatmentPlan,
 medicationPrescribed, labTestOrdered, referralMade, followUpRequired,
 status, noteType)
VALUES
-- Sarah Johnson - Diabetes management note
(1, 1, 'Diabetes Management',
 'Patient reports feeling dizzy occasionally. Also mentions increased thirst and frequent urination.',
 '130/85', '72', '36.7', '68',
 'Patient appears alert and oriented. No signs of acute distress. Fundoscopic exam normal.',
 'Type 2 Diabetes',
 'Blood sugar levels are within acceptable range but trending higher. Patient compliance with medication is good. Diet could be improved.',
 'Continue current medication regimen (Metformin 500mg twice daily). Monitor blood sugar daily. Recommend dietary consultation. Schedule follow-up in 3 months.',
 TRUE, TRUE, FALSE, TRUE,
 'Synced', 'SOAP Note'),

-- Michael Chen - Follow-up note
(2, 1, 'Hypertension',
 'Patient reports no new symptoms. Blood pressure has been stable at home monitoring.',
 '135/90', '78', '36.9', '82',
 'Blood pressure slightly elevated today. Patient is overweight. Cardiovascular exam otherwise normal.',
 'Hypertension',
 'Hypertension well controlled overall. Patient would benefit from weight loss and increased exercise.',
 'Continue current antihypertensive medication. Recommend 30 minutes of moderate exercise daily. Reduce sodium intake. Follow-up in 2 months.',
 FALSE, FALSE, FALSE, TRUE,
 'Synced', 'SOAP Note'),

-- Emily Rodriguez - Routine checkup
(3, 2, 'Routine Checkup',
 'No current complaints. Patient here for annual physical examination.',
 '118/75', '68', '36.5', '62',
 'General physical examination within normal limits. All systems reviewed and normal.',
 'Healthy',
 'Patient is in good health. No acute or chronic medical issues identified.',
 'Continue healthy lifestyle. No medications needed at this time. Return for routine checkup in 1 year.',
 FALSE, TRUE, FALSE, FALSE,
 'Synced', 'SOAP Note'),

-- James Wilson - Recent note
(4, 2, 'Follow-up',
 'Patient seen for follow-up after minor injury.',
 '122/80', '65', '36.8', '75',
 'Wound healing well. No signs of infection.',
 'Minor Injury',
 'Wound care proceeding as expected.',
 'Continue current wound care. Return if signs of infection develop.',
 FALSE, FALSE, FALSE, FALSE,
 'Synced', 'Progress Note');


-- ==========================================
-- MESSAGES (Inbox)
-- ==========================================

INSERT INTO Message
(senderId, receiverId, subject, content, sentTime, statusId, isRead)
VALUES
-- Unread messages
(3, 1, 'Consultation Note',
 'Patient seen for tachycardia. Recommend dosage adjustment. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
 '2026-02-15 10:30:00', 1, FALSE),

(3, 1, 'Consultation Note',
 'Patient seen for tachycardia. Recommend dosage adjustment. Complete follow-up examination scheduled for next week.',
 '2026-02-15 10:30:00', 1, FALSE),

-- Read messages
(2, 1, 'Lab Results',
 'Patient seen for tachycardia. Recommend dosage adjustment. Blood pressure is stable.',
 '2026-02-14 10:30:00', 3, TRUE),

(4, 1, 'Patient File Request',
 'Patient seen for tachycardia. Recommend dosage adjustment. Patient responded well to treatment.',
 '2026-02-13 10:30:00', 3, TRUE);


-- ==========================================
-- TEST DATA COMPLETE
-- ==========================================
