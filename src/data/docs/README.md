# OSCAR Mobile Database

## Overview
This directory contains the PostgreSQL database schema and test data for the OSCAR Mobile application.

## Files
- **oscar_schema.sql** - Complete database schema with all tables, indexes, and views
- **oscar_test.sql** - Realistic test data matching the React app screens

## How to Set Up

### 1. Create Database
```bash
psql -U postgres
CREATE DATABASE oscar_mobile;
\c oscar_mobile
```

### 2. Run Schema
```bash
psql -U postgres -d oscar_mobile -f oscar_schema.sql
```

### 3. Load Test Data
```bash
psql -U postgres -d oscar_mobile -f oscar_test.sql
```

## Database Changes Summary

### ✅ New Tables Added

1. **PatientAllergy** - Stores patient allergies (shown in Patient Record screens)
2. **EmergencyContact** - Emergency contact information
3. **MedicalCondition** - Patient's medical conditions with diagnosis years
4. **Medication** - Current medications with dosage and frequency
5. **VitalSigns** - Historical vital signs measurements

### ✅ Updated Tables

1. **Patient**
   - Added `patientNumber` (e.g., P-0021) - matches UI
   - Added `lastVisit` - shown on patient cards
   - Renamed `patientEmail` to `email`

2. **ClinicalNote** - **Major Restructure**
   - Changed from simple `content TEXT` to full SOAP format:
     - **Subjective**: chiefComplaint, subjectiveDescription
     - **Objective**: bloodPressure, heartRate, temperature, weight, objectiveDescription
     - **Assessment**: diagnosisCategory, clinicalAssessment
     - **Plan**: treatmentPlan, medicationPrescribed, labTestOrdered, referralMade, followUpRequired
   - Added `status` (Draft/Synced)
   - Added `noteType` (SOAP Note, Progress Note, etc.)

3. **Message**
   - Added `subject` field - shown in Inbox screen
   - Added `isRead` boolean - tracks read/unread status

4. **Appointment**
   - Added `createdAt` and `updatedAt` timestamps

### ✅ Removed Tables

- **PatientRecord** - Removed (was redundant, only had lastUpdateTime)

### ✅ Added Indexes

Performance indexes on:
- Patient search (patientNumber, fullName)
- All foreign keys
- Date fields (recordedDate, appointmentDate, createdAt)
- Status fields (isRead, status)

### ✅ Added View

**vw_PatientSummary** - Aggregates patient data with counts:
- Total appointments
- Total notes
- Total vital records
- Calculated age

## Test Data Highlights

### Patients
- **10 realistic patients** with matching data from UI
- Patient #1 (Sarah Johnson / P-0021) - Featured in prototypes
- Varied ages, genders, and contact information

### Medical Data
- **Allergies** for 5 patients (including Sarah Johnson's Penicillin/Shellfish)
- **Medical Conditions** - Hypertension, Diabetes, Asthma, etc.
- **Medications** - Active prescriptions with proper dosing
- **Emergency Contacts** for all patients

### Vital Signs
- **Multiple readings** for Sarah Johnson showing history
- Realistic BP, HR, weight, and temperature values
- Associated with clinicians who recorded them

### Clinical Notes
- **4 complete SOAP notes** with all fields populated
- Mix of Synced and Draft statuses
- Different note types (SOAP Note, Progress Note)
- Realistic clinical content

### Messages
- **4 messages** (2 unread, 2 read)
- Includes long message content for testing expand/collapse
- Proper subject lines matching Inbox UI

### Appointments
- **7 appointments** (4 upcoming, 3 completed)
- Various types: Consultation, Follow-up, Routine Check
- Realistic reasons and locations

## API Integration Guide

When building your API, you can query data like this:

### Get Patient List
```sql
SELECT
    p.patientId,
    p.patientNumber AS id,
    p.fullName AS name,
    EXTRACT(YEAR FROM AGE(p.dob)) AS age,
    p.gender,
    TO_CHAR(p.dob, 'Mon DD, YYYY') AS dob,
    TO_CHAR(p.lastVisit, 'Mon DD, YYYY') AS lastVisit
FROM Patient p
ORDER BY p.patientNumber;
```

### Get Patient Detail with Allergies, Conditions, Medications
```sql
SELECT
    p.*,
    EXTRACT(YEAR FROM AGE(p.dob)) AS age,
    ARRAY_AGG(DISTINCT pa.allergyName) FILTER (WHERE pa.allergyName IS NOT NULL) AS allergies,
    ec.name AS emergencyContactName,
    ec.relationship AS emergencyContactRelationship,
    ec.phone AS emergencyContactPhone
FROM Patient p
LEFT JOIN PatientAllergy pa ON p.patientId = pa.patientId
LEFT JOIN EmergencyContact ec ON p.patientId = ec.patientId
WHERE p.patientNumber = 'P-0021'
GROUP BY p.patientId, ec.contactId;
```

### Get Clinical Notes for Patient
```sql
SELECT
    cn.*,
    c.name AS doctorName,
    TO_CHAR(cn.createdAt, 'Mon DD, YYYY') AS date
FROM ClinicalNote cn
JOIN Clinician c ON cn.clinicianId = c.clinicianId
WHERE cn.patientId = (SELECT patientId FROM Patient WHERE patientNumber = 'P-0021')
ORDER BY cn.createdAt DESC;
```

### Get Vital Signs History
```sql
SELECT
    TO_CHAR(recordedDate, 'Mon DD, YYYY') AS date,
    bloodPressure,
    heartRate,
    weight || 'kg' AS weight,
    temperature || '°C' AS temperature
FROM VitalSigns
WHERE patientId = (SELECT patientId FROM Patient WHERE patientNumber = 'P-0021')
ORDER BY recordedDate DESC;
```

### Get Inbox Messages
```sql
SELECT
    m.messageId AS id,
    c.name AS sender,
    m.subject,
    SUBSTRING(m.content, 1, 100) || '...' AS preview,
    m.content AS fullContent,
    TO_CHAR(m.sentTime, 'HH12:MI AM') AS time,
    m.isRead
FROM Message m
JOIN Clinician c ON m.senderId = c.clinicianId
WHERE m.receiverId = 1
ORDER BY m.sentTime DESC;
```

## Schema-UI Alignment

| Screen | Database Tables Used |
|--------|---------------------|
| **Patients List** | Patient |
| **Patient Summary** | Patient, PatientAllergy, EmergencyContact, MedicalCondition, Medication, VitalSigns |
| **Patient Notes** | ClinicalNote, Clinician |
| **Patient History** | Appointment, AppointmentType, Clinician |
| **Patient Vitals** | VitalSigns, Clinician |
| **Clinical Note** | ClinicalNote, Patient (SOAP format) |
| **Inbox** | Message, MessageStatus, Clinician |
| **Schedule** | Appointment, AppointmentType, AppointmentStatus, Patient |

## Notes

- All patient data uses realistic Canadian phone formats
- Dates follow the format used in the UI (e.g., "Feb 9, 2026")
- Test data includes the specific patient shown in your prototypes (Sarah Johnson / P-0021)
- Database is fully normalized with proper foreign key constraints
- CASCADE deletes ensure data integrity
