import express from 'express';
import request from 'supertest';
import { vi } from 'vitest';

function createMockDb() {
  const messages = [
    { messageId: 1, subject: 'Hello', content: 'This is a message', sentTime: '2026-02-15 10:30:00', isRead: 0, senderName: 'Dr. Smith' }
  ];
  const statuses = { Sent: 1 };

  function prepare(sql) {
    const lower = sql.toLowerCase();
    return {
      all: (param) => {
        if (lower.includes('from message') && lower.includes('where m.receiverid = ?')) return messages;
        return [];
      },
      get: (param) => {
        if (lower.includes("where statusname = 'sent'")) return { statusId: statuses.Sent };
        return undefined;
      },
      run: (...args) => {
        if (lower.includes('update message set isread')) return {};
        if (lower.includes('insert into message')) return { lastInsertRowid: 99 };
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
  app.use('/api/messages', router);
  return app;
}

describe('server/routes/messages', () => {
  let app;
  beforeAll(async () => {
    const mod = await import('../../../server/routes/messages.js');
    const router = mod.default;
    app = createApp(router);
  });

  it('GET /api/messages returns inbox list', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PATCH /api/messages/:id/read marks message read', async () => {
    const res = await request(app).patch('/api/messages/1/read');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('PATCH /api/messages/read-all marks all messages read', async () => {
    const res = await request(app).patch('/api/messages/read-all');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('POST /api/messages creates a message', async () => {
    const res = await request(app).post('/api/messages').send({ receiverId: 2, content: 'Hi' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('messageId');
  });
});

