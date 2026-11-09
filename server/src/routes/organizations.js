import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function formatOrg(org) {
  if (!org) return null;
  return {
    ...org,
    palette: typeof org.palette === 'string' ? JSON.parse(org.palette) : org.palette,
    publicKeyJwk: org.publicKeyJwk && typeof org.publicKeyJwk === 'string' ? JSON.parse(org.publicKeyJwk) : org.publicKeyJwk
  };
}

// List all organizations
router.get('/', async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(orgs.map(formatOrg));
  } catch (err) {
    console.error('Fetch orgs error:', err);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// Get single organization
router.get('/:id', async (req, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.params.id }
    });
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json(formatOrg(org));
  } catch (err) {
    console.error('Fetch org error:', err);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Create organization (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      shortCode,
      category,
      college,
      president,
      adviser,
      paletteKey,
      palette,
      color,
      eccKeyId,
      publicKeyJwk
    } = req.body;

    const id = req.body.id || 'org_' + (shortCode?.toLowerCase() || Date.now().toString(36));

    const newOrg = await prisma.organization.create({
      data: {
        id,
        name,
        shortCode,
        category: category || 'Academic RSO',
        college: college || 'University of the Assumption',
        president: president || '',
        adviser: adviser || '',
        paletteKey: paletteKey || 'GRAY',
        palette: typeof palette === 'object' ? JSON.stringify(palette) : (palette || '{}'),
        color: color || '',
        eccKeyStatus: 'ACTIVE',
        eccKeyId: eccKeyId || ('ecc_' + id),
        publicKeyJwk: typeof publicKeyJwk === 'object' ? JSON.stringify(publicKeyJwk) : (publicKeyJwk || null)
      }
    });

    res.status(201).json(formatOrg(newOrg));
  } catch (err) {
    console.error('Create org error:', err);
    res.status(500).json({ error: 'Failed to create organization: ' + err.message });
  }
});

// Update organization
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;

    if (data.palette && typeof data.palette === 'object') {
      data.palette = JSON.stringify(data.palette);
    }
    if (data.publicKeyJwk && typeof data.publicKeyJwk === 'object') {
      data.publicKeyJwk = JSON.stringify(data.publicKeyJwk);
    }

    const updated = await prisma.organization.update({
      where: { id: req.params.id },
      data
    });

    res.json(formatOrg(updated));
  } catch (err) {
    console.error('Update org error:', err);
    res.status(500).json({ error: 'Failed to update organization: ' + err.message });
  }
});

// Delete organization
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const orgId = req.params.id;
    // Cascade delete events, evaluations, action plans
    await prisma.evaluation.deleteMany({ where: { organizationId: orgId } });
    await prisma.actionPlan.deleteMany({ where: { organizationId: orgId } });
    await prisma.event.deleteMany({ where: { organizationId: orgId } });
    await prisma.organization.delete({ where: { id: orgId } });

    res.json({ success: true, message: 'Organization deleted successfully' });
  } catch (err) {
    console.error('Delete org error:', err);
    res.status(500).json({ error: 'Failed to delete organization: ' + err.message });
  }
});

export default router;

