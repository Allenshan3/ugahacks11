import mongoose, { Schema, Model } from "mongoose";

export interface IVerificationToken {
  _id: string;
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true, // for fast lookups
    },
    code: {
      type: String,
      required: [true, "Verification code is required"],
      length: 6,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration time is required"],
      // MongoDB TTL index: auto-delete after expiresAt passes
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const VerificationToken: Model<IVerificationToken> =
  (mongoose.models && (mongoose.models.VerificationToken as Model<IVerificationToken>)) ||
  mongoose.model<IVerificationToken>("VerificationToken", VerificationTokenSchema);

export default VerificationToken;
