import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    // Simple Admin Auth via Env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
