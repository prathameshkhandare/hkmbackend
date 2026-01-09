import express from 'express';
import { createRegistration, getRegistrations } from '../controllers/icvkController';
import { upload } from '../config/cloudinary';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', upload.fields([
    { name: 'childPhoto', maxCount: 1 },
    { name: 'paymentScreenshot', maxCount: 1 }
]), createRegistration);

router.get('/registrations', protect, getRegistrations);

export default router;
