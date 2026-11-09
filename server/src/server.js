import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import orgRoutes from './routes/organizations.js';
import eventRoutes from './routes/events.js';
import evalRoutes from './routes/evaluations.js';
import actionPlanRoutes from './routes/actionPlans.js';
import cryptoRoutes from './routes/crypto.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'University of the Assumption — StudEval Backend',
    motto: 'biasa, maganaca, mayap',
    time: new Date().toISOString()
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/evaluations', evalRoutes);
app.use('/api/action-plans', actionPlanRoutes);
app.use('/api/crypto', cryptoRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown') });
});

app.listen(PORT, () => {
  console.log(`🚀 StudEval Backend running on http://localhost:${PORT}`);
});

