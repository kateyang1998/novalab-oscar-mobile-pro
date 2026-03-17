// ─── server/index.js ──────────────────────────────────────────────────────────
// Express API server — auto-initializes SQLite database with schema and test data.

import express from 'express';
import cors from 'cors';
import { getDb } from './db.js';
import patientsRouter     from './routes/patients.js';
import appointmentsRouter from './routes/appointments.js';
import messagesRouter     from './routes/messages.js';
import clinicianRouter    from './routes/clinician.js';
import notesRouter        from './routes/notes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize (and seed) the database before accepting requests
getDb();

app.use('/api/patients',     patientsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/messages',     messagesRouter);
app.use('/api/clinician',    clinicianRouter);
app.use('/api/notes',        notesRouter);

app.listen(PORT, () => {
  console.log(`OSCAR API server running on http://localhost:${PORT}`);
});
