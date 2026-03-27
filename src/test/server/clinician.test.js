import express from 'express';
import request from 'supertest';
import { vi } from 'vitest';

// Mock DB for clinician routes
function createMockDb() {
  const clinicians = {
    1: { clinicianId: 1, name: 'Dr. Lee', role: 'Doctor', email: 'dr.lee@clinic.ca' }
  };
  const auth = { 1: { password: 'currentPass' } };

  function prepare(sql) {
    const lower = sql.toLowerCase();
    return {
      get: (param) => {
        const id = Number(param);
        if (lower.includes('from clinician where clinicianid')) return clinicians[id] || undefined;
        if (lower.includes('select password from clinicianauth')) return auth[id] ? { password: auth[id].password } : undefined;
        return undefined;
      },
      all: () => [],
      run: (val, id) => {
        const cid = Number(id);
        auth[cid] = { password: val };
        return {};
      }
    };
  }

  return { prepare };
}

const mockDbInstance = createMockDb();
vi.mock('../../../server/db.js', () => ({ getDb: () => mockDbInstance }));

function createApp(router) {
  const app = express();
  app.use(express.json());
  app.use('/api/clinician', router);
  return app;
}

describe('server/routes/clinician', () => {
  let app;
  beforeAll(async () => {
    const mod = await import('../../../server/routes/clinician.js');
    const router = mod.default;
    app = createApp(router);
  });

  it('GET /api/clinician returns clinician info', async () => {
    const res = await request(app).get('/api/clinician');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('clinicianId', 1);
    expect(res.body).toHaveProperty('name', 'Dr. Lee');
  });

  it('PUT /api/clinician/password validates missing fields', async () => {
    const res = await request(app).put('/api/clinician/password').send({});
    expect(res.status).toBe(400);
  });

  it('PUT /api/clinician/password validates short password', async () => {
    const res = await request(app).put('/api/clinician/password').send({ currentPassword: 'currentPass', newPassword: 'short' });
    expect(res.status).toBe(400);
  });

  it('PUT /api/clinician/password rejects incorrect current password', async () => {
    const res = await request(app).put('/api/clinician/password').send({ currentPassword: 'wrong', newPassword: 'longenough' });
    expect(res.status).toBe(401);
  });

  it('PUT /api/clinician/password updates password on success', async () => {
    const res = await request(app).put('/api/clinician/password').send({ currentPassword: 'currentPass', newPassword: 'newstrongpass' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('POST /api/clinician/sync returns a timestamp', async () => {
    const res = await request(app).post('/api/clinician/sync').send({});
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('syncedAt');
  });
});


