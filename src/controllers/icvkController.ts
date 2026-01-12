
import { Context } from 'hono';
import { getSupabase } from '../lib/supabase';
import { sendRegistrationEmailAsync } from '../services/emailService';

// Validate Cloudinary URL
const validateCloudinaryUrl = (url: string, cloudName: string): boolean => {
  if (typeof url !== 'string') return false;
  
  // Match Cloudinary URL pattern with version number
  const pattern = new RegExp(
    `^https://res\\.cloudinary\\.com/${cloudName}/image/upload/v\\d+/icvk/registrations/`
  );
  return pattern.test(url);
};

export const createRegistration = async (c: Context) => {
  console.log("[Controller] createRegistration called");

  try {
    const body = await c.req.json();
    const { childPhotoUrl, paymentScreenshotUrl } = body;

    // Get env from context for Cloudflare Workers
    const env = c.env as any;
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      console.error("[Controller] CLOUDINARY_CLOUD_NAME not configured");
      return c.json({ 
        success: false,
        message: 'Server configuration error' 
      }, 500);
    }

    // Validate URLs are provided
    if (!childPhotoUrl || !paymentScreenshotUrl) {
      return c.json({ 
        success: false,
        message: 'Both childPhotoUrl and paymentScreenshotUrl are required' 
      }, 400);
    }

    // Validate URLs are valid Cloudinary URLs matches folder
    if (!validateCloudinaryUrl(childPhotoUrl, cloudName)) {
      return c.json({ 
        success: false,
        message: 'Invalid childPhotoUrl. Must be a valid Cloudinary URL in icvk/registrations folder' 
      }, 400);
    }

    if (!validateCloudinaryUrl(paymentScreenshotUrl, cloudName)) {
      return c.json({ 
        success: false,
        message: 'Invalid paymentScreenshotUrl. Must be a valid Cloudinary URL in icvk/registrations folder' 
      }, 400);
    }

    // Initialize Supabase
    const supabase = getSupabase(env);

    // Create registration
    const { data, error } = await supabase
      .from('Registration')
      .insert([
        {
            id: crypto.randomUUID(),
            childName: body.childName,
            dob: body.dob, // Supabase handles ISO strings
            age: Number(body.age),
            gender: body.gender,
            bloodGroup: body.bloodGroup,
            center: body.center,
            batch: body.batch,
            schoolName: body.schoolName,
            fatherName: body.fatherName,
            motherName: body.motherName,
            address: body.address,
            fatherMobile: body.fatherMobile,
            motherMobile: body.motherMobile,
            pickupName: body.pickupName,
            pickupContact: body.pickupContact,
            pickupRelation: body.pickupRelation,
            gitaLifeInterest: body.gitaLifeInterest,
            mediaConsent: body.mediaConsent === 'Yes' || body.mediaConsent === 'true' || body.mediaConsent === true,
            email: body.email,
            childPhotoUrl,
            paymentScreenshotUrl,
            updatedAt: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
        throw error;
    }

    const savedRegistration = data;
    console.log("[Controller] Registration saved:", savedRegistration.id);

    // 🔥 SEND EMAIL ASYNC
    // Note: This might fail in Workers if using standard smtp. 
    // Ideally should be offloaded to a Queue or HTTP-based email service.
    if (body.email) {
       // We pass env if needed by service in future, but current service uses process.env
       // Ideally we refactor service too, but keeping minimal changes for now.
       try {
         sendRegistrationEmailAsync(body.email, savedRegistration);
       } catch (e) {
         console.error("Email trigger failed in Worker", e);
       }
    }

    return c.json({
      success: true,
      message: 'Registration successful',
      registrationId: savedRegistration.id,
    }, 201);

  } catch (error: any) {
    console.error("🔥 [Controller] Create Registration Error:", error);
    return c.json({ 
      success: false,
      message: 'Registration Failed', 
      error: error.message || 'Unknown Error',
    }, 500);
  }
};

export const getRegistrations = async (c: Context) => {
    try {
        const env = c.env as any;
        const supabase = getSupabase(env);
        
        const { data: registrations, error } = await supabase
          .from('Registration')
          .select('*')
          .order('createdAt', { ascending: false });

        if (error) throw error;
        
        return c.json(registrations);
    } catch (error) {
        return c.json({ message: 'Server Error' }, 500);
    }
};
