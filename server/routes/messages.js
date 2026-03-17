// ─── server/routes/messages.js ────────────────────────────────────────────────
import { Router } from 'express';
import { getDb } from '../db.js';
import { formatTime12h } from '../utils.js';

const router = Router();
const CURRENT_CLINICIAN_ID = 1; // Dr. Lee

// GET /api/messages — inbox for current clinician
router.get('/', (req, res) => {
  const db = getDb();
  const messages = db.prepare(`
    SELECT m.messageId, m.subject, m.content, m.sentTime, m.isRead,
           c.name AS senderName
    FROM Message m
    JOIN Clinician c ON m.senderId = c.clinicianId
    WHERE m.receiverId = ?
    ORDER BY m.sentTime DESC
  `).all(CURRENT_CLINICIAN_ID);

  res.json(messages.map(m => {
    const preview = m.content.length > 80
      ? m.content.substring(0, 80) + '...'
      : m.content;
    return {
      id:          String(m.messageId),
      sender:      m.senderName,
      subject:     m.subject,
      preview,
      fullContent: m.content,
      time:        formatTime12h(m.sentTime),
      isRead:      m.isRead === 1,
    };
  }));
});

// PATCH /api/messages/:id/read — mark a single message read
router.patch('/:id/read', (req, res) => {
  const db = getDb();
  db.prepare('UPDATE Message SET isRead = 1 WHERE messageId = ?').run(req.params.id);
  res.json({ success: true });
});

// PATCH /api/messages/read-all — mark all messages read for current clinician
router.patch('/read-all', (req, res) => {
  const db = getDb();
  db.prepare('UPDATE Message SET isRead = 1 WHERE receiverId = ?').run(CURRENT_CLINICIAN_ID);
  res.json({ success: true });
});

export default router;
