
import { Hono } from 'hono';
import { createRegistration, getRegistrations } from '../controllers/icvkController';
import { protect } from '../middleware/auth';

const app = new Hono();

// Accept JSON only - no file uploads middleware needed as we expect JSON
app.post('/register', createRegistration);

app.get('/registrations', protect, getRegistrations);

export default app;
