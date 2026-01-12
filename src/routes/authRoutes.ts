
import { Hono } from 'hono';
import { login } from '../controllers/authController';

const app = new Hono();

app.post('/login', login);

export default app;
