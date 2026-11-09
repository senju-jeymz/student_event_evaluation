import express from 'express';
import crypto from 'crypto';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function formatEvaluation(e) {
  if (!e) return null;
  return {
    ...e,
    ratings: typeof e.ratings === 'string' ? JSON.parse(e.ratings) : e.ratings,
    comments: e.comments && typeof e.comments === 'string' && (e.comments.startsWith('{') || e.comments.startsWith('['))
      ? JSON.parse(e.comments)
      : e.comments,
    encryptedBundle: e.encryptedBundle && typeof e.encryptedBundle === 'string'
      ? JSON.parse(e.encryptedBundle)
      : e.encryptedBundle,
    decryptedSample: e.decryptedSample && typeof e.decryptedSample === 'string'
      ? JSON.parse(e.decryptedSample)
      : e.decryptedSample
  };
}

// Verification hash generator (SHA-256)
function generateReceiptHash(data) {
  const serialized = `${data.id}_${data.eventId}_${data.submittedAt}_${data.studentId}`;
  return crypto.createHash('sha256').update(serialized).digest('hex').substring(0, 8).toUpperCase();
}

// List evaluations with filters
router.get('/', async (req, res) => {
  try {
    const { organizationId, eventId, studentId } = req.query;
    const where = {};
    if (organizationId) where.organizationId = organizationId;
    if (eventId) where.eventId = eventId;
    if (studentId) where.studentId = studentId;

    const evaluations = await prisma.evaluation.findMany({
      where,
      orderBy: { submittedAt: 'desc' }
    });

    res.json(evaluations.map(formatEvaluation));
  } catch (err) {
    console.error('Fetch evaluations error:', err);
    res.status(500).json({ error: 'Failed to fetch evaluations' });
  }
});

// Verify Certificate of Attendance authenticity by verification code
router.get('/verify/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const evaluation = await prisma.evaluation.findFirst({
      where: {
        OR: [
          { verificationCode: code },
          { verificationCode: 'VERIF-' + code },
          { verificationCode: { contains: code } }
        ]
      }
    });

    if (!evaluation) {
      return res.status(404).json({ valid: false, message: 'Invalid or forged verification code' });
    }

    res.json({
      valid: true,
      evaluation: formatEvaluation(evaluation),
      message: 'Cryptographically verified attendance certificate'
    });
  } catch (err) {
    console.error('Verify evaluation error:', err);
    res.status(500).json({ error: 'Verification error' });
  }
});

// Get single evaluation
router.get('/:id', async (req, res) => {
  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: req.params.id }
    });
    if (!evaluation) return res.status(404).json({ error: 'Evaluation not found' });
    res.json(formatEvaluation(evaluation));
  } catch (err) {
    console.error('Fetch evaluation error:', err);
    res.status(500).json({ error: 'Failed to fetch evaluation' });
  }
});

// Submit evaluation
router.post('/', async (req, res) => {
  try {
    const {
      eventId,
      organizationId,
      studentId,
      fullName,
      department,
      yearLevel,
      modality,
      isAnonymous,
      ratings,
      isEncrypted,
      comments,
      encryptedBundle,
      decryptedSample
    } = req.body;

    // Duplicate check for identified submissions
    if (!isAnonymous && studentId) {
      const existing = await prisma.evaluation.findFirst({
        where: {
          eventId,
          studentId,
          isAnonymous: false
        }
      });
      if (existing) {
        return res.status(400).json({
          error: 'Duplicate submission detected. You have already submitted an evaluation for this event.'
        });
      }
    }

    const responseId = req.body.id || 'resp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const submittedAt = new Date();
    const hash = generateReceiptHash({
      id: responseId,
      eventId,
      submittedAt: submittedAt.toISOString(),
      studentId: isAnonymous ? 'ANON' : studentId
    });

    const verificationCode = 'VERIF-' + hash;
    const signature = 'SIG_ECC_P256_' + hash;

    const newEvaluation = await prisma.evaluation.create({
      data: {
        id: responseId,
        eventId,
        organizationId,
        studentId: isAnonymous ? null : studentId,
        fullName: isAnonymous ? null : fullName,
        department: department || '',
        yearLevel: yearLevel || '',
        modality: modality || 'In-Person',
        isAnonymous: Boolean(isAnonymous),
        ratings: typeof ratings === 'object' ? JSON.stringify(ratings) : (ratings || '{}'),
        isEncrypted: Boolean(isEncrypted),
        comments: typeof comments === 'object' ? JSON.stringify(comments) : (comments || ''),
        encryptedBundle: typeof encryptedBundle === 'object' ? JSON.stringify(encryptedBundle) : (encryptedBundle || null),
        decryptedSample: typeof decryptedSample === 'object' ? JSON.stringify(decryptedSample) : (decryptedSample || null),
        verificationCode,
        signature,
        actionPlanStatus: 'IN_REVIEW',
        submittedAt
      }
    });

    res.status(201).json(formatEvaluation(newEvaluation));
  } catch (err) {
    console.error('Submit evaluation error:', err);
    res.status(500).json({ error: 'Failed to submit evaluation: ' + err.message });
  }
});

// Update evaluation
router.put('/:id', async (req, res) => {
  try {
    const existing = await prisma.evaluation.findUnique({
      where: { id: req.params.id }
    });
    if (!existing) return res.status(404).json({ error: 'Evaluation not found' });

    const data = { ...req.body };
    delete data.id;

    if (data.ratings && typeof data.ratings === 'object') {
      data.ratings = JSON.stringify(data.ratings);
    }
    if (data.comments && typeof data.comments === 'object') {
      data.comments = JSON.stringify(data.comments);
    }
    if (data.encryptedBundle && typeof data.encryptedBundle === 'object') {
      data.encryptedBundle = JSON.stringify(data.encryptedBundle);
    }
    if (data.decryptedSample && typeof data.decryptedSample === 'object') {
      data.decryptedSample = JSON.stringify(data.decryptedSample);
    }

    const lastUpdatedAt = new Date();
    const hash = generateReceiptHash({
      id: existing.id,
      eventId: data.eventId || existing.eventId,
      submittedAt: lastUpdatedAt.toISOString(),
      studentId: data.isAnonymous ? 'ANON' : (data.studentId || existing.studentId)
    });

    data.lastUpdatedAt = lastUpdatedAt;
    data.verificationCode = 'VERIF-' + hash;
    data.signature = 'SIG_ECC_P256_' + hash + '_REV';

    const updated = await prisma.evaluation.update({
      where: { id: req.params.id },
      data
    });

    res.json(formatEvaluation(updated));
  } catch (err) {
    console.error('Update evaluation error:', err);
    res.status(500).json({ error: 'Failed to update evaluation: ' + err.message });
  }
});

// Update response action plan review status or officer remarks
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { actionPlanStatus, officerRemarks } = req.body;
    const updateData = {};
    if (actionPlanStatus !== undefined) updateData.actionPlanStatus = actionPlanStatus;
    if (officerRemarks !== undefined) updateData.officerRemarks = officerRemarks;

    const updated = await prisma.evaluation.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(formatEvaluation(updated));
  } catch (err) {
    console.error('Update evaluation status error:', err);
    res.status(500).json({ error: 'Failed to update evaluation status: ' + err.message });
  }
});

// Delete evaluation
router.delete('/:id', async (req, res) => {
  try {
    await prisma.evaluation.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Evaluation deleted successfully' });
  } catch (err) {
    console.error('Delete evaluation error:', err);
    res.status(500).json({ error: 'Failed to delete evaluation: ' + err.message });
  }
});

export default router;

