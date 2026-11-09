import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function formatVault(v) {
  if (!v) return null;
  return {
    ...v,
    publicKeyJwk: typeof v.publicKeyJwk === 'string' ? JSON.parse(v.publicKeyJwk) : v.publicKeyJwk,
    encryptedVault: typeof v.encryptedVault === 'string' ? JSON.parse(v.encryptedVault) : v.encryptedVault
  };
}

// Get all vaults (or specific org vault)
router.get('/vaults', async (req, res) => {
  try {
    const vaults = await prisma.eccVault.findMany();
    const vaultMap = {};
    for (const v of vaults) {
      vaultMap[v.organizationId] = formatVault(v);
    }
    res.json(vaultMap);
  } catch (err) {
    console.error('Fetch vaults error:', err);
    res.status(500).json({ error: 'Failed to fetch vaults' });
  }
});

// Get vault for single org
router.get('/vaults/:orgId', async (req, res) => {
  try {
    const vault = await prisma.eccVault.findUnique({
      where: { organizationId: req.params.orgId }
    });
    if (!vault) return res.status(404).json({ error: 'Vault not found' });
    res.json(formatVault(vault));
  } catch (err) {
    console.error('Fetch org vault error:', err);
    res.status(500).json({ error: 'Failed to fetch vault' });
  }
});

// Save / rotate vault record
router.put('/vaults/:orgId', authenticateToken, async (req, res) => {
  try {
    const orgId = req.params.orgId;
    const { keyId, publicKeyJwk, encryptedVault, algorithm } = req.body;

    const pubStr = typeof publicKeyJwk === 'object' ? JSON.stringify(publicKeyJwk) : publicKeyJwk;
    const encStr = typeof encryptedVault === 'object' ? JSON.stringify(encryptedVault) : encryptedVault;

    const vault = await prisma.eccVault.upsert({
      where: { organizationId: orgId },
      update: {
        keyId,
        publicKeyJwk: pubStr,
        encryptedVault: encStr,
        algorithm: algorithm || 'ECDH-P256-AES-GCM-256'
      },
      create: {
        organizationId: orgId,
        keyId,
        publicKeyJwk: pubStr,
        encryptedVault: encStr,
        algorithm: algorithm || 'ECDH-P256-AES-GCM-256'
      }
    });

    // Sync public key to organization table
    await prisma.organization.update({
      where: { id: orgId },
      data: {
        eccKeyId: keyId,
        publicKeyJwk: pubStr,
        eccKeyStatus: 'ACTIVE'
      }
    }).catch(e => console.warn('Org public key sync warning:', e.message));

    res.json(formatVault(vault));
  } catch (err) {
    console.error('Save vault error:', err);
    res.status(500).json({ error: 'Failed to save vault: ' + err.message });
  }
});

// List audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    res.json(logs);
  } catch (err) {
    console.error('Fetch audit logs error:', err);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Record new audit log
router.post('/audit-logs', async (req, res) => {
  try {
    const { action, severity, actor, actorRole, organizationId, details } = req.body;
    const log = await prisma.auditLog.create({
      data: {
        id: 'aud_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        action,
        severity: severity || 'INFO',
        actor: actor || 'System',
        actorRole: actorRole || 'SYSTEM',
        organizationId: organizationId || 'GLOBAL',
        details: details || ''
      }
    });
    res.status(201).json(log);
  } catch (err) {
    console.error('Create audit log error:', err);
    res.status(500).json({ error: 'Failed to record audit log: ' + err.message });
  }
});

export default router;

