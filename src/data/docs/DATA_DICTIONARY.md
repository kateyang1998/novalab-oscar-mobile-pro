# OSCAR Mobile - Data Dictionary

## Overview
This document provides detailed field-level definitions for all database tables in the OSCAR Mobile application.

---

## Table of Contents
1. [Clinician](#clinician)
2. [Patient](#patient)
3. [PatientAllergy](#patientallergy)
4. [EmergencyContact](#emergencycontact)
5. [MedicalCondition](#medicalcondition)
6. [Medication](#medication)
7. [VitalSigns](#vitalsigns)
8. [AppointmentType](#appointmenttype)
9. [AppointmentStatus](#appointmentstatus)
10. [Appointment](#appointment)
11. [ClinicalNote](#clinicalnote)
12. [MessageStatus](#messagestatus)
13. [Message](#message)
14. [Views](#views)

---

## Clinician

Stores information about healthcare providers who use the system.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **clinicianId** | SERIAL | PRIMARY KEY | Unique identifier for the clinician | 1 |
| **name** | VARCHAR(100) | NOT NULL | Full name of the clinician | Dr. Lee |
| **role** | VARCHAR(50) | NOT NULL | Job title or role | Doctor, Nurse |
| **email** | VARCHAR(100) | NOT NULL, UNIQUE | Work email address | dr.lee@clinic.ca |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Account creation timestamp | 2026-01-15 09:00:00 |

**Usage Notes:**
- Used for authentication and authorization
- Referenced by appointments, clinical notes, and messages
- Role field can be expanded to include: Doctor, Nurse, Physician Assistant, etc.

---

## Patient

Stores demographic and contact information for patients.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **patientId** | SERIAL | PRIMARY KEY | Unique identifier for the patient | 1 |
| **patientNumber** | VARCHAR(20) | NOT NULL, UNIQUE | Human-readable patient ID | P-0021 |
| **fullName** | VARCHAR(100) | NOT NULL | Patient's full name | Sarah Johnson |
| **dob** | DATE | NOT NULL | Date of birth | 1979-01-14 |
| **gender** | VARCHAR(20) | | Gender identity | Female, Male, Other |
| **phone** | VARCHAR(20) | | Primary contact phone number | (555) 123-4567 |
| **email** | VARCHAR(100) | | Patient's email address | sarah.j@email.com |
| **lastVisit** | DATE | | Date of most recent visit | 2026-02-09 |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Patient record creation date | 2026-01-01 10:00:00 |

**Usage Notes:**
- `patientNumber` is displayed in the UI (format: P-XXXX)
- Age is calculated from `dob` in queries (not stored)
- `lastVisit` is updated after each appointment
- Used in Patients List and Patient Record screens

---

## PatientAllergy

Stores allergy information for patients.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **allergyId** | SERIAL | PRIMARY KEY | Unique identifier for the allergy record | 1 |
| **patientId** | INTEGER | NOT NULL, FK | Reference to Patient table | 1 |
| **allergyName** | VARCHAR(100) | NOT NULL | Name of the allergen | Penicillin |
| **severity** | VARCHAR(20) | | Severity level of allergy | Mild, Moderate, Severe |

**Usage Notes:**
- Displayed in yellow warning box on Patient Record screens
- Multiple allergies can exist per patient
- Critical safety information - prominently displayed
- Common allergens: Penicillin, Shellfish, Peanuts, Latex, etc.

---

## EmergencyContact

Stores emergency contact information for patients.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **contactId** | SERIAL | PRIMARY KEY | Unique identifier for the contact | 1 |
| **patientId** | INTEGER | NOT NULL, UNIQUE, FK | Reference to Patient table (one contact per patient) | 1 |
| **name** | VARCHAR(100) | NOT NULL | Full name of emergency contact | John Johnson |
| **relationship** | VARCHAR(50) | | Relationship to patient | Spouse, Parent, Sibling |
| **phone** | VARCHAR(20) | | Contact phone number | (555) 987-6543 |

**Usage Notes:**
- One emergency contact per patient (enforced by UNIQUE constraint)
- Displayed on all Patient Record screens
- Format in UI: "Name (Relationship) - Phone"

---

## MedicalCondition

Stores chronic and ongoing medical conditions for patients.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **conditionId** | SERIAL | PRIMARY KEY | Unique identifier for the condition | 1 |
| **patientId** | INTEGER | NOT NULL, FK | Reference to Patient table | 1 |
| **conditionName** | VARCHAR(100) | NOT NULL | Name of the medical condition | Hypertension |
| **diagnosedYear** | VARCHAR(4) | | Year of diagnosis | 2020 |
| **notes** | TEXT | | Additional notes about the condition | Well controlled with medication |

**Usage Notes:**
- Displayed in Patient Record Summary screen
- Multiple conditions can exist per patient
- Common conditions: Hypertension, Type 2 Diabetes, Asthma, COPD
- Used for clinical decision support and care planning

---

## Medication

Stores current medication information for patients.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **medicationId** | SERIAL | PRIMARY KEY | Unique identifier for the medication record | 1 |
| **patientId** | INTEGER | NOT NULL, FK | Reference to Patient table | 1 |
| **medicationName** | VARCHAR(100) | NOT NULL | Name of the medication | Metformin |
| **dosage** | VARCHAR(50) | | Dosage amount | 500mg |
| **frequency** | VARCHAR(50) | | How often medication is taken | Twice daily |
| **isActive** | BOOLEAN | DEFAULT TRUE | Whether medication is currently active | TRUE |

**Usage Notes:**
- Displayed in Patient Record Summary screen
- Multiple medications per patient
- `isActive` flag allows maintaining history without deletion
- Frequency examples: Once daily, Twice daily, As needed, Every 8 hours

---

## VitalSigns

Stores historical vital sign measurements for patients.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **vitalId** | SERIAL | PRIMARY KEY | Unique identifier for the vital record | 1 |
| **patientId** | INTEGER | NOT NULL, FK | Reference to Patient table | 1 |
| **recordedDate** | TIMESTAMP | NOT NULL | Date and time vitals were taken | 2026-02-09 10:30:00 |
| **bloodPressure** | VARCHAR(20) | | Blood pressure reading | 130/85 |
| **heartRate** | INTEGER | | Heart rate in beats per minute | 72 |
| **weight** | DECIMAL(5,2) | | Weight in kilograms | 68.00 |
| **temperature** | DECIMAL(4,2) | | Temperature in Celsius | 36.7 |
| **notes** | TEXT | | Additional observations | Patient was anxious |
| **clinicianId** | INTEGER | FK | Reference to clinician who recorded vitals | 1 |

**Usage Notes:**
- Displayed in Patient Record Vitals and Summary screens
- Historical data allows trending over time
- Also captured in SOAP notes (Objective section)
- Indexed by patient and date for performance

---

## AppointmentType

Lookup table for appointment types.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **typeId** | SERIAL | PRIMARY KEY | Unique identifier for appointment type | 1 |
| **typeName** | VARCHAR(50) | NOT NULL | Name of the appointment type | Consultation |

**Predefined Values:**
- Consultation
- Follow-up
- Routine Check
- Emergency

**Usage Notes:**
- Reference data table
- Used in Schedule and Appointment screens
- Can be extended with additional types as needed

---

## AppointmentStatus

Lookup table for appointment statuses.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **statusId** | SERIAL | PRIMARY KEY | Unique identifier for status | 1 |
| **statusName** | VARCHAR(50) | NOT NULL | Name of the status | Booked |

**Predefined Values:**
- Booked
- Rescheduled
- Cancelled
- Completed

**Usage Notes:**
- Reference data table
- Tracks appointment lifecycle
- Used for filtering and reporting

---

## Appointment

Stores appointment scheduling information.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **appointmentId** | SERIAL | PRIMARY KEY | Unique identifier for appointment | 1 |
| **appointmentDate** | DATE | NOT NULL | Date of appointment | 2026-03-20 |
| **startTime** | TIMESTAMP | NOT NULL | Appointment start date/time | 2026-03-20 09:00:00 |
| **endTime** | TIMESTAMP | NOT NULL | Appointment end date/time | 2026-03-20 09:30:00 |
| **statusId** | INTEGER | NOT NULL, FK | Reference to AppointmentStatus | 1 |
| **typeId** | INTEGER | NOT NULL, FK | Reference to AppointmentType | 1 |
| **reason** | TEXT | | Reason for visit | Diabetes management |
| **location** | VARCHAR(100) | | Location/room | Room 101 |
| **patientId** | INTEGER | NOT NULL, FK | Reference to Patient | 1 |
| **clinicianId** | INTEGER | NOT NULL, FK | Reference to Clinician | 1 |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | When appointment was created | 2026-02-01 14:00:00 |
| **updatedAt** | TIMESTAMP | DEFAULT NOW() | Last modification time | 2026-02-05 10:30:00 |

**Usage Notes:**
- Displayed in Schedule screen and Patient History
- Duration calculated from `startTime` and `endTime`
- Past appointments (`status = Completed`) serve as visit history
- Indexed by patient, clinician, date, and status

---

## ClinicalNote

Stores clinical notes in SOAP (Subjective, Objective, Assessment, Plan) format.

### Identifying Fields

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **noteId** | SERIAL | PRIMARY KEY | Unique identifier for note | 1 |
| **patientId** | INTEGER | NOT NULL, FK | Reference to Patient | 1 |
| **clinicianId** | INTEGER | NOT NULL, FK | Reference to Clinician who created note | 1 |

### SOAP: Subjective Section
Patient's reported symptoms and concerns.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **chiefComplaint** | VARCHAR(200) | | Primary reason for visit | Diabetes Management |
| **subjectiveDescription** | TEXT | | Patient's description of symptoms | Patient reports feeling dizzy occasionally... |

### SOAP: Objective Section
Measurable clinical findings and observations.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **bloodPressure** | VARCHAR(20) | | Blood pressure reading | 130/85 |
| **heartRate** | VARCHAR(10) | | Heart rate in bpm | 72 |
| **temperature** | VARCHAR(10) | | Temperature in Celsius | 36.7 |
| **weight** | VARCHAR(10) | | Weight in kg | 68 |
| **objectiveDescription** | TEXT | | Clinical observations | Patient appears alert and oriented... |

### SOAP: Assessment Section
Clinical diagnosis and interpretation.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **diagnosisCategory** | VARCHAR(100) | | Primary diagnosis | Type 2 Diabetes |
| **clinicalAssessment** | TEXT | | Detailed clinical assessment | Blood sugar levels are within acceptable range... |

### SOAP: Plan Section
Treatment plan and follow-up.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **treatmentPlan** | TEXT | | Detailed treatment plan | Continue current medication regimen... |
| **medicationPrescribed** | BOOLEAN | DEFAULT FALSE | Whether medication was prescribed | TRUE |
| **labTestOrdered** | BOOLEAN | DEFAULT FALSE | Whether lab tests were ordered | TRUE |
| **referralMade** | BOOLEAN | DEFAULT FALSE | Whether referral was made | FALSE |
| **followUpRequired** | BOOLEAN | DEFAULT FALSE | Whether follow-up is needed | TRUE |

### Metadata Fields

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **status** | VARCHAR(20) | DEFAULT 'Draft' | Note status | Draft, Synced |
| **noteType** | VARCHAR(50) | DEFAULT 'SOAP Note' | Type of clinical note | SOAP Note, Progress Note |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | When note was created | 2026-02-09 10:45:00 |
| **updatedAt** | TIMESTAMP | DEFAULT NOW() | Last modification time | 2026-02-09 11:00:00 |

**Usage Notes:**
- SOAP format is standard in medical documentation
- Draft notes can be edited; Synced notes are finalized
- Displayed in Patient Record Notes screen
- Plan checkboxes used for quick documentation
- Indexed by patient, clinician, status, and creation date

---

## MessageStatus

Lookup table for message statuses.

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **statusId** | SERIAL | PRIMARY KEY | Unique identifier for status | 1 |
| **statusName** | VARCHAR(50) | NOT NULL | Name of the status | Sent |

**Predefined Values:**
- Sent - Message has been sent
- Delivered - Message delivered to recipient
- Read - Message has been read

**Usage Notes:**
- Tracks message delivery lifecycle
- Similar to email or messaging app statuses

---

## Message

Stores messages between clinicians (inbox system).

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| **messageId** | SERIAL | PRIMARY KEY | Unique identifier for message | 1 |
| **senderId** | INTEGER | NOT NULL, FK | Reference to Clinician who sent | 3 |
| **receiverId** | INTEGER | NOT NULL, FK | Reference to Clinician who receives | 1 |
| **subject** | VARCHAR(200) | | Message subject line | Consultation Note |
| **content** | TEXT | NOT NULL | Full message content | Patient seen for tachycardia... |
| **sentTime** | TIMESTAMP | DEFAULT NOW() | When message was sent | 2026-02-15 10:30:00 |
| **statusId** | INTEGER | NOT NULL, FK | Reference to MessageStatus | 1 |
| **isRead** | BOOLEAN | DEFAULT FALSE | Whether message has been read | FALSE |

**Usage Notes:**
- Displayed in Inbox screen
- `isRead` controls blue border indicator in UI
- Preview generated from first 100 characters of content
- Click to expand shows full content
- Indexed by sender, receiver, status, and read flag

---

## Views

### vw_PatientSummary

Aggregated view providing patient overview with statistics.

| Field Name | Data Type | Description | Example |
|------------|-----------|-------------|---------|
| **patientId** | INTEGER | Patient's unique ID | 1 |
| **patientNumber** | VARCHAR(20) | Patient number | P-0021 |
| **fullName** | VARCHAR(100) | Patient's full name | Sarah Johnson |
| **dob** | DATE | Date of birth | 1979-01-14 |
| **gender** | VARCHAR(20) | Gender | Female |
| **phone** | VARCHAR(20) | Phone number | (555) 123-4567 |
| **email** | VARCHAR(100) | Email address | sarah.j@email.com |
| **lastVisit** | DATE | Most recent visit date | 2026-02-09 |
| **age** | INTEGER | Calculated age from DOB | 45 |
| **totalAppointments** | BIGINT | Count of all appointments | 5 |
| **totalNotes** | BIGINT | Count of clinical notes | 3 |
| **totalVitals** | BIGINT | Count of vital sign records | 4 |

**Usage Notes:**
- Convenient aggregated data for dashboards
- Age automatically calculated
- Counts help identify active patients
- Can be used for reporting and analytics

---

## Field Naming Conventions

### Primary Keys
- Format: `tableName + Id` (e.g., `patientId`, `noteId`)
- Data Type: `SERIAL` (auto-incrementing integer)
- Always named consistently for clarity

### Foreign Keys
- Use same name as referenced primary key
- Constraints named: `fk_table_referencedtable`
- Always indexed for performance

### Timestamps
- `createdAt` - Record creation time
- `updatedAt` - Last modification time
- `sentTime` - Specific to messages
- `recordedDate` - Specific to vital signs

### Boolean Flags
- Named with "is" prefix: `isActive`, `isRead`
- Or descriptive name: `medicationPrescribed`, `labTestOrdered`
- Default values specified in schema

### Status Fields
- Usually reference lookup tables
- Named: `statusId` or `status` (for text)
- Improves data integrity and reporting

---

## Data Type Glossary

| Data Type | Description | Use Case |
|-----------|-------------|----------|
| **SERIAL** | Auto-incrementing integer | Primary keys |
| **INTEGER** | Whole number | Foreign keys, counts, IDs |
| **VARCHAR(n)** | Variable-length text up to n chars | Names, short text |
| **TEXT** | Unlimited text | Long descriptions, notes |
| **DATE** | Calendar date only | Birth dates, appointment dates |
| **TIMESTAMP** | Date and time | Precise timing, audit trails |
| **DECIMAL(p,s)** | Fixed-point number | Measurements (weight, temp) |
| **BOOLEAN** | True/false value | Flags, yes/no fields |

---

## Constraint Glossary

| Constraint | Description | Example |
|------------|-------------|---------|
| **PRIMARY KEY** | Unique identifier for table | `patientId SERIAL PRIMARY KEY` |
| **FOREIGN KEY (FK)** | Reference to another table | `patientId INTEGER REFERENCES Patient(patientId)` |
| **NOT NULL** | Field must have a value | `name VARCHAR(100) NOT NULL` |
| **UNIQUE** | Value must be unique in table | `email VARCHAR(100) UNIQUE` |
| **DEFAULT** | Default value if not provided | `isActive BOOLEAN DEFAULT TRUE` |
| **CASCADE** | Delete related records automatically | `ON DELETE CASCADE` |

---

## Relationships Summary

```
Clinician (1) ──── (Many) Appointment
Clinician (1) ──── (Many) ClinicalNote
Clinician (1) ──── (Many) Message (as sender)
Clinician (1) ──── (Many) Message (as receiver)
Clinician (1) ──── (Many) VitalSigns

Patient (1) ──── (Many) PatientAllergy
Patient (1) ──── (1) EmergencyContact
Patient (1) ──── (Many) MedicalCondition
Patient (1) ──── (Many) Medication
Patient (1) ──── (Many) VitalSigns
Patient (1) ──── (Many) Appointment
Patient (1) ──── (Many) ClinicalNote

AppointmentType (1) ──── (Many) Appointment
AppointmentStatus (1) ──── (Many) Appointment
MessageStatus (1) ──── (Many) Message
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-15 | Initial data dictionary creation |

---

## Maintenance Notes

**When adding new fields:**
1. Update this data dictionary with field definition
2. Add appropriate indexes if used in queries
3. Update test data to include sample values
4. Document in README.md if it affects API queries

**Field modification checklist:**
1. Update data dictionary
2. Update schema file
3. Update test data
4. Update API documentation
5. Test with existing data

---

*Last Updated: March 15, 2026*
