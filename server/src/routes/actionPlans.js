import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// List action plans
router.get('/', async (req, res) => {
  try {
    const { organizationId, eventId } = req.query;
    const where = {};
    if (organizationId) where.organizationId = organizationId;
    if (eventId) where.eventId = eventId;

    const plans = await prisma.actionPlan.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(plans);
  } catch (err) {
    console.error('Fetch action plans error:', err);
    res.status(500).json({ error: 'Failed to fetch action plans' });
  }
});

// Create action plan
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { organizationId, eventId, title, originFeedback, assignedTo, dueDate, status } = req.body;
    const id = req.body.id || 'act_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);

    const newPlan = await prisma.actionPlan.create({
      data: {
        id,
        organizationId: organizationId || req.user.organizationId,
        eventId: eventId || null,
        title,
        originFeedback: originFeedback || '',
        assignedTo: assignedTo || '',
        dueDate: dueDate || '',
        status: status || 'IN_PROGRESS'
      }
    });

    res.status(201).json(newPlan);
  } catch (err) {
    console.error('Create action plan error:', err);
    res.status(500).json({ error: 'Failed to create action plan: ' + err.message });
  }
});

// Update action plan
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;

    const updated = await prisma.actionPlan.update({
      where: { id: req.params.id },
      data
    });
    res.json(updated);
  } catch (err) {
    console.error('Update action plan error:', err);
    res.status(500).json({ error: 'Failed to update action plan: ' + err.message });
  }
});

// Quick status update
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.actionPlan.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    console.error('Update action plan status error:', err);
    res.status(500).json({ error: 'Failed to update action plan status: ' + err.message });
  }
});

// Delete action plan
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.actionPlan.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Action plan deleted successfully' });
  } catch (err) {
    console.error('Delete action plan error:', err);
    res.status(500).json({ error: 'Failed to delete action plan: ' + err.message });
  }
});

export default router;

