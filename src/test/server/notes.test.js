import express from 'express';
import request from 'supertest';
import { vi } from 'vitest';

// Build a simple in-memory mock DB that implements the minimal interface
// used by server/routes/notes.js (prepare(...).get/run)
function createMockDb() {
  const patients = { 'P-0021': { patientId: 1, patientNumber: 'P-0021' } };
  const notes = {};
  let nextNoteId = 1000;

  function prepare(sql) {
    const lower = sql.toLowerCase();
    return {
      get: (param) => {
        if (lower.includes('from patient') && lower.includes('where patientnumber')) {
          return patients[param] ? { patientId: patients[param].patientId } : undefined;
        }
        // generic clinical note fetch by noteId (support queries that reference cn.noteId or noteId)
        if (lower.includes('from clinicalnote') && lower.includes('where') && lower.includes('noteid')) {
          const n = notes[param];
          if (!n) return undefined;
          // build a row similar to real DB
          return { ...n, patientNumber: Object.values(patients).find(p => p.patientId === n.patientId)?.patientNumber ?? 'P-UNKNOWN' };
        }
        if (lower.includes('select count(*)') ) {
          return { count: 0 };
        }
        return undefined;
      },
      run: (...args) => {
        if (lower.includes('insert into clinicalnote')) {
          const id = nextNoteId++;
          // args[0] is patientId according to server route insertion order
          const patientId = args[0];
          notes[id] = { noteId: id, patientId, chiefComplaint: args[2] || null };
          return { lastInsertRowid: id };
        }
        if (lower.includes('update clinicalnote')) {
          const noteId = args[args.length - 1];
          const existing = notes[noteId];
          if (existing) {
            existing.chiefComplaint = args[0] || existing.chiefComplaint;
          }
          return { changes: existing ? 1 : 0 };
        }
        if (lower.includes('delete from clinicalnote')) {
          const noteId = args[0];
          delete notes[noteId];
          return { changes: 1 };
        }
        return {};
      }
    };
  }

  return { prepare };
}

// Create a single shared mock DB instance and mock the server db module BEFORE
// importing the notes router so the router will use this mock instead of the
// real sqlite-backed getDb.
const mockDbInstance = createMockDb();
vi.mock('../../../server/db.js', () => ({ getDb: () => mockDbInstance }));

// Create an express app and mount the notes router after the mock is active
function createApp(notesRouter) {
  const app = express();
  app.use(express.json());
  app.use('/api/notes', notesRouter);
  return app;
}

describe('server/routes/notes', () => {
  let app;
  let db = mockDbInstance;

  beforeAll(async () => {
    // Import the router after mocking so it uses the mocked getDb
    const mod = await import('../../../server/routes/notes.js');
    const notesRouter = mod.default;
    app = createApp(notesRouter);
  });

  it('GET /api/notes/:noteId returns 404 for non-existing note', async () => {
    const res = await request(app).get('/api/notes/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/notes returns 404 when patient not found', async () => {
    const payload = { patientId: 'NON-EXISTENT', chiefComplaint: 'Test' };
    const res = await request(app).post('/api/notes').send(payload);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Patient not found');
  });

  it('POST /api/notes creates a new note when patient exists', async () => {
    // Use existing seeded patient P-0021
    const payload = {
      patientId: 'P-0021',
      chiefComplaint: 'Test Complaint',
      subjectiveDescription: 'Test subjective',
    };

    const res = await request(app).post('/api/notes').send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('noteId');

    // cleanup the created note by deleting it
    const noteId = res.body.noteId;
    const del = await request(app).delete(`/api/notes/${noteId}`);
    expect(del.status).toBe(200);
    expect(del.body).toHaveProperty('success', true);
  });

  it('PUT /api/notes/:noteId updates an existing note', async () => {
    // create a note to update
    const createRes = await request(app).post('/api/notes').send({ patientId: 'P-0021', chiefComplaint: 'To update' });
    expect(createRes.status).toBe(200);
    const noteId = createRes.body.noteId;

    const updateRes = await request(app).put(`/api/notes/${noteId}`).send({ chiefComplaint: 'Updated' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty('success', true);

    // fetch and verify updated chiefComplaint via direct DB read
    const row = db.prepare('SELECT chiefComplaint FROM ClinicalNote WHERE noteId = ?').get(noteId);
    expect(row.chiefComplaint).toBe('Updated');

    // cleanup
    await request(app).delete(`/api/notes/${noteId}`);
  });

  it('DELETE /api/notes/:noteId deletes a note', async () => {
    const createRes = await request(app).post('/api/notes').send({ patientId: 'P-0021', chiefComplaint: 'To delete' });
    const noteId = createRes.body.noteId;

    const delRes = await request(app).delete(`/api/notes/${noteId}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body).toHaveProperty('success', true);

    // ensure the note no longer exists
    const getRes = await request(app).get(`/api/notes/${noteId}`);
    expect(getRes.status).toBe(404);
  });
});



