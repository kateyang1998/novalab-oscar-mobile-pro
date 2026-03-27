import express from 'express';
import request from 'supertest';
import { vi } from 'vitest';

// Minimal mock DB tailored for patients routes
function createMockDb() {
  const patients = {
    'P-0021': { patientId: 1, patientNumber: 'P-0021', fullName: 'John Doe', dob: '1980-01-01', gender: 'Male', phone: '123', email: 'a@b.com', lastVisit: '2026-02-09' }
  };
  const allergies = { 1: [{ allergyName: 'Penicillin' }] };
  const emergency = { 1: { name: 'Jane', relationship: 'Spouse', phone: '555' } };
  const conditions = { 1: [{ conditionName: 'Hypertension', diagnosedYear: '2019' }] };
  const medications = { 1: [{ medicationName: 'Metformin', dosage: '500mg', frequency: 'BID' }] };
  const vitals = { 1: [{ vitalId: 10, recordedDate: '2026-02-09 10:30:00', bloodPressure: '120/80', heartRate: 72, weight: 68, temperature: 36.7 }] };
  const notes = { 1: [{ noteId: 100, chiefComplaint: 'Test', status: 'Synced', noteType: 'SOAP Note', createdAt: '2026-02-01', clinicianName: 'Dr. Lee' }] };
  const appointments = { 1: [{ appointmentId: 200, appointmentDate: '2026-02-09', reason: 'Visit', clinicianName: 'Dr. Lee', statusName: 'Booked' }] };

  function prepare(sql) {
    const lower = sql.toLowerCase();
    return {
      get: (param) => {
        if (lower.includes('from patient where patientnumber')) {
          return patients[param] || undefined;
        }
        if (lower.includes('from emergencycontact')) {
          return emergency[param];
        }
        if (lower.includes("from vitalsign")) {
          // return latest
          const arr = vitals[param] || [];
          return arr[0] || undefined;
        }
        if (lower.includes("from appointmentstatus where statusname = 'cancelled'")) return { statusId: 3 };
        return undefined;
      },
      all: (param) => {
        if (lower.includes('from patient') && lower.includes('order by lastvisit')) {
          return Object.values(patients);
        }
        if (lower.includes('from patientallergy')) {
          return allergies[param] || [];
        }
        if (lower.includes('from medicalcondition')) {
          return conditions[param] || [];
        }
        if (lower.includes('from medication')) {
          return medications[param] || [];
        }
        if (lower.includes('from clinicalnote')) {
          return notes[param] || [];
        }
        if (lower.includes('from vitalsigns')) {
          return vitals[param] || [];
        }
        if (lower.includes('from appointment')) {
          return appointments[param] || [];
        }
        return [];
      },
      run: () => ({})
    };
  }

  return { prepare };
}

const mockDbInstance = createMockDb();
vi.mock('../../../server/db.js', () => ({ getDb: () => mockDbInstance }));

function createApp(router) {
  const app = express();
  app.use(express.json());
  app.use('/api/patients', router);
  return app;
}

describe('server/routes/patients', () => {
  let app;

  beforeAll(async () => {
    const mod = await import('../../../server/routes/patients.js');
    const router = mod.default;
    app = createApp(router);
  });

  it('GET /api/patients returns a list', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/patients/:patientNumber returns 404 when not found', async () => {
    const res = await request(app).get('/api/patients/NOPE');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Patient not found');
  });

  it('GET /api/patients/:patientNumber returns full patient record', async () => {
    const res = await request(app).get('/api/patients/P-0021');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 'P-0021');
    expect(res.body).toHaveProperty('allergies');
    expect(res.body).toHaveProperty('medications');
    expect(res.body).toHaveProperty('vitals');
  });

  it('GET notes, vitals and history endpoints', async () => {
    const notesRes = await request(app).get('/api/patients/P-0021/notes');
    expect(notesRes.status).toBe(200);
    expect(Array.isArray(notesRes.body)).toBe(true);

    const vitalsRes = await request(app).get('/api/patients/P-0021/vitals');
    expect(vitalsRes.status).toBe(200);
    expect(Array.isArray(vitalsRes.body)).toBe(true);

    const histRes = await request(app).get('/api/patients/P-0021/history');
    expect(histRes.status).toBe(200);
    expect(Array.isArray(histRes.body)).toBe(true);
  });
});

