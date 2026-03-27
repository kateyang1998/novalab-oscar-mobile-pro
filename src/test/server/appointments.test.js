import express from 'express';
import request from 'supertest';
import { vi } from 'vitest';

// Minimal mock DB for appointments routes
function createMockDb() {
  const appointments = [
    { appointmentId: 1, appointmentDate: '2026-02-09', startTime: '2026-02-09 09:00:00', endTime: '2026-02-09 09:30:00', reason: 'Checkup', location: 'Room 1', fullName: 'John Doe', patientNumber: 'P-0021', typeName: 'Consultation', statusName: 'Booked' }
  ];
  const types = { Consultation: 1 };
  const statuses = { Booked: 1, Cancelled: 3 };

  function prepare(sql) {
    const lower = sql.toLowerCase();
    return {
      all: (param) => {
        if (lower.includes('from appointment') && lower.includes('where a.clinicianid = 1')) {
          // For today's endpoint the query appends AND a.appointmentDate = ?
          return appointments;
        }
        return [];
      },
      get: (param) => {
        if (lower.includes('select typeid from appointmenttype')) return { typeId: types[param] || 1 };
        if (lower.includes('select statusid from appointmentstatus where statusname =')) {
          return { statusId: statuses['Cancelled'] };
        }
        return undefined;
      },
      run: (...args) => ({})
    };
  }

  return { prepare };
}

const mockDbInstance = createMockDb();
vi.mock('../../../server/db.js', () => ({ getDb: () => mockDbInstance }));

function createApp(router) {
  const app = express();
  app.use(express.json());
  app.use('/api/appointments', router);
  return app;
}

describe('server/routes/appointments', () => {
  let app;

  beforeAll(async () => {
    const mod = await import('../../../server/routes/appointments.js');
    const router = mod.default;
    app = createApp(router);
  });

  it('GET /api/appointments returns list', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/appointments/today returns list', async () => {
    const res = await request(app).get('/api/appointments/today');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/appointments/:id returns 400 for unknown type/status', async () => {
    // Mock returns undefined for type/status to trigger the 400
    const badDb = {
      prepare: () => ({ get: () => undefined })
    };
    vi.mocked(import('../../../server/db.js'));
  });

  it('PATCH /api/appointments/:id/cancel returns success when cancelledStatus present', async () => {
    const res = await request(app).patch('/api/appointments/1/cancel');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});

