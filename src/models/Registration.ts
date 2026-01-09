import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  childName: string;
  dob: Date;
  age: number;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  center: 'Mogappair' | 'Thiruvanmiyur';
  batch: 'Gopala' | 'Keshava' | 'Govinda' | 'Madhava';
  schoolName: string;
  fatherName: string;
  motherName: string;
  address: string;
  fatherMobile: string;
  motherMobile: string;
  pickupName: string;
  pickupContact: string;
  pickupRelation: string;
  gitaLifeInterest: string;
  mediaConsent: boolean;
  childPhotoUrl: string;
  paymentScreenshotUrl: string;
  createdAt: Date;
}

const RegistrationSchema: Schema = new Schema({
  childName: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  bloodGroup: { type: String, required: true },
  center: { type: String, enum: ['Mogappair', 'Thiruvanmiyur'], required: true },
  batch: { type: String, enum: ['Gopala', 'Keshava', 'Govinda', 'Madhava'], required: true },
  schoolName: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  address: { type: String, required: true },
  fatherMobile: { type: String, required: true },
  motherMobile: { type: String, required: true },
  pickupName: { type: String, required: true },
  pickupContact: { type: String, required: true },
  pickupRelation: { type: String, required: true },
  gitaLifeInterest: { type: String, required: true },
  mediaConsent: { type: Boolean, required: true },
  childPhotoUrl: { type: String, required: true },
  paymentScreenshotUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
