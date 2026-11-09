import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Lookup user by username or email (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username.trim() } },
          { email: { equals: username.trim() } }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check password (support both direct password and bcrypt)
    let passwordMatches = false;
    if (user.password === password) {
      passwordMatches = true;
    } else {
      try {
        passwordMatches = await bcrypt.compare(password, user.password);
      } catch (err) {
        passwordMatches = false;
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get currently logged-in user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error('Fetch me error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get demo accounts for the quick-login dropdown
router.get('/accounts', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        organizationId: true,
        title: true,
        avatar: true,
        adviser: true,
        studentId: true,
        department: true,
        yearLevel: true
      },
      orderBy: { role: 'asc' }
    });
    res.json(users);
  } catch (err) {
    console.error('Fetch accounts error:', err);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

export default router;

