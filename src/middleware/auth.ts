
import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

// Hono middleware signature
export const protect = async (c: Context, next: Next) => {
    let token;
    const authHeader = c.req.header('Authorization');

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            token = authHeader.split(' ')[1];
            const env = c.env as any; 
            const secret = env.JWT_SECRET || 'secret';
            
            console.log("Verifying token...");
            const decoded = await verify(token, secret);
            console.log("Token verified:", decoded);
            
            c.set('user', decoded);
            await next();
        } catch (error) {
            console.error("Auth Error:", error);
            // Must return response to stop execution if error
            return c.json({ message: 'Not authorized, token failed' }, 401);
        }
    }

    if (!token) {
        console.log("No token found");
        return c.json({ message: 'Not authorized, no token' }, 401);
    }
};
