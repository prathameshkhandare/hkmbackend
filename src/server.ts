
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import icvkRoutes from './routes/icvkRoutes';
import authRoutes from './routes/authRoutes';

const app = new Hono();

// Global Middleware
app.use('/*', cors());

// Routes
app.route('/api/icvk', icvkRoutes);
app.route('/api/auth', authRoutes);

// Health Check
app.get('/', (c) => c.text('API is running on Cloudflare Workers'));
app.get('/ping', (c) => c.text('Pong!'));

// Error Handler
app.onError((err, c) => {
  console.error('🔥 [Global Error]', err);
  return c.json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  }, 500);
});

export default app;
