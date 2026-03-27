import express from 'express';
import request from 'supertest';
import { vi } from 'vitest';

// Mock DB for auth routes
function createMockDb() {
  const clinicians = {
    1: { clinicianId: 1, name: 'Dr. Lee', role: 'Doctor', email: 'dr.lee@clinic.ca' }
  };
  const auth = {
    1: { password: 'oscar123' }
  };

  function prepare(sql) {
    const lower = sql.toLowerCase();
    return {
      get: (param) => {
        const id = Number(param);
        if (lower.includes('from clinician where clinicianid')) {
          return clinicians[id] || undefined;
        }
        if (lower.includes('select password from clinicianauth')) {
          return auth[id] ? { password: auth[id].password } : undefined;
        }
        // generic select used in tests: mockDbInstance.prepare('select').get(id)
        if (lower.trim().startsWith('select')) {
          return auth[id] ? { password: auth[id].password } : undefined;
        }
        return undefined;
      },
      run: (val, clinicianId) => {
        const id = Number(clinicianId);
        if (!isNaN(id)) {
          auth[id] = { password: val };
        }
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
  app.use('/api/auth', router);
  return app;
}

describe('server/routes/auth', () => {
  let app;

  beforeAll(async () => {
    const mod = await import('../../../server/routes/auth.js');
    const router = mod.default;
    app = createApp(router);
  });

  it('POST /api/auth/login returns 400 when missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({ userId: '', password: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/auth/login returns 401 for invalid userId', async () => {
    const res = await request(app).post('/api/auth/login').send({ userId: 'CLABC', password: 'x' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('POST /api/auth/login returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ userId: 'CL000001', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('POST /api/auth/login returns clinician info on success', async () => {
    const res = await request(app).post('/api/auth/login').send({ userId: 'CL000001', password: 'oscar123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('clinicianId', 1);
    expect(res.body).toHaveProperty('name', 'Dr. Lee');
  });

  it('POST /api/auth/forgot-password returns 400 when missing userId', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/auth/forgot-password returns 404 when user not found', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ userId: 'CL999999' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User ID not found');
  });

  it('POST /api/auth/forgot-password resets password when user exists', async () => {
    // change password to something else first
    mockDbInstance.prepare('update').run('tempPass', 1);
    expect(mockDbInstance.prepare('select').get(1).password).toBe('tempPass');

    const res = await request(app).post('/api/auth/forgot-password').send({ userId: 'CL000001' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(mockDbInstance.prepare('select').get(1).password).toBe('oscar123');
  });
});


