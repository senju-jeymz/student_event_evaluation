import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function formatEvent(e) {
  if (!e) return null;
  return {
    ...e,
    speakers: typeof e.speakers === 'string' ? JSON.parse(e.speakers) : e.speakers,
    tags: typeof e.tags === 'string' ? JSON.parse(e.tags) : e.tags
  };
}

// List all events
router.get('/', async (req, res) => {
  try {
    const { organizationId } = req.query;
    const where = organizationId ? { organizationId } : {};
    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(events.map(formatEvent));
  } catch (err) {
    console.error('Fetch events error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(formatEvent(event));
  } catch (err) {
    console.error('Fetch event error:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      organizationId,
      category,
      date,
      time,
      venue,
      modality,
      speakers,
      tags,
      description,
      expectedAttendees,
      evaluationOpen,
      eccEncryptionRequired,
      status
    } = req.body;

    const id = req.body.id || 'evt_' + Date.now().toString(36);

    const newEvent = await prisma.event.create({
      data: {
        id,
        organizationId: organizationId || req.user.organizationId,
        title,
        category: category || 'General',
        date: date || new Date().toISOString().slice(0, 10),
        time: time || '01:00 PM - 05:00 PM',
        venue: venue || 'Main Campus',
        modality: modality || 'In-Person',
        speakers: typeof speakers === 'object' ? JSON.stringify(speakers) : (speakers || '[]'),
        tags: typeof tags === 'object' ? JSON.stringify(tags) : (tags || '[]'),
        description: description || '',
        expectedAttendees: Number(expectedAttendees) || 100,
        evaluationOpen: evaluationOpen !== undefined ? evaluationOpen : true,
        eccEncryptionRequired: eccEncryptionRequired !== undefined ? eccEncryptionRequired : true,
        status: status || (evaluationOpen !== false ? 'ACTIVE' : 'UPCOMING')
      }
    });

    res.status(201).json(formatEvent(newEvent));
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Failed to create event: ' + err.message });
  }
});

// Update event
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;

    if (data.speakers && typeof data.speakers === 'object') {
      data.speakers = JSON.stringify(data.speakers);
    }
    if (data.tags && typeof data.tags === 'object') {
      data.tags = JSON.stringify(data.tags);
    }
    if (data.expectedAttendees !== undefined) {
      data.expectedAttendees = Number(data.expectedAttendees);
    }
    if (data.evaluationOpen !== undefined) {
      data.status = data.evaluationOpen ? 'ACTIVE' : (data.status === 'COMPLETED' ? 'COMPLETED' : 'UPCOMING');
    }

    const updated = await prisma.event.update({
      where: { id: req.params.id },
      data
    });

    res.json(formatEvent(updated));
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ error: 'Failed to update event: ' + err.message });
  }
});

// Toggle evaluation status
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const existing = await prisma.event.findUnique({
      where: { id: req.params.id }
    });
    if (!existing) return res.status(404).json({ error: 'Event not found' });

    const nextState = !existing.evaluationOpen;
    const updated = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        evaluationOpen: nextState,
        status: nextState ? 'ACTIVE' : 'UPCOMING'
      }
    });

    res.json(formatEvent(updated));
  } catch (err) {
    console.error('Toggle event error:', err);
    res.status(500).json({ error: 'Failed to toggle event: ' + err.message });
  }
});

// Delete event (with cascade)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    await prisma.evaluation.deleteMany({ where: { eventId } });
    await prisma.actionPlan.deleteMany({ where: { eventId } });
    await prisma.event.delete({ where: { id: eventId } });

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Failed to delete event: ' + err.message });
  }
});

export default router;

