
import { Context } from 'hono';
import { sign } from 'hono/jwt';

export const login = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();
        const env = c.env as any;
        
        // Simple Admin Auth via Env
        if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
            const token = await sign({ email }, env.JWT_SECRET || 'secret');
            return c.json({ token });
        } else {
            return c.json({ message: 'Invalid email or password' }, 401);
        }
    } catch (e) {
        return c.json({ message: 'Invalid Request' }, 400);
    }
};
