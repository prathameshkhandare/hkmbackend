import { Request, Response } from 'express';
import Registration from '../models/Registration';
import { z } from 'zod';

export const createRegistration = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!files || !files['childPhoto'] || !files['paymentScreenshot']) {
            return res.status(400).json({ message: 'Missing files' });
        }

        const childPhoto = files['childPhoto'][0];
        const paymentScreenshot = files['paymentScreenshot'][0];

        const registration = new Registration({
            ...body,
            dob: new Date(body.dob),
            mediaConsent: body.mediaConsent === 'Yes' || body.mediaConsent === 'true',
            childPhotoUrl: childPhoto.path,
            paymentScreenshotUrl: paymentScreenshot.path,
        });

        await registration.save();
        res.status(201).json({ message: 'Registration successful', registration });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
};

export const getRegistrations = async (req: Request, res: Response) => {
    try {
        const registrations = await Registration.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
