import express from 'express';
import request from 'supertest';
import { vi } from 'vitest';

function createMockDb() {
  const settingsRows = [ { settingKey: 'biometricLogin', settingValue: '1' }, { settingKey: 'autoLock', settingValue: '0' } ];

  function prepare(sql) {
    const lower = sql.toLowerCase();
    return {
      all: () => settingsRows,
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
  app.use('/api/settings', router);
  return app;
}

describe('server/routes/settings', () => {
  let app;
  beforeAll(async () => {
    const mod = await import('../../../server/routes/settings.js');
    const router = mod.default;
    app = createApp(router);
  });

  it('GET /api/settings returns settings object', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('biometricLogin', true);
    expect(res.body).toHaveProperty('autoLock', false);
  });

  it('PUT /api/settings updates settings', async () => {
    const res = await request(app).put('/api/settings').send({ biometricLogin: false, autoLock: true });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});

