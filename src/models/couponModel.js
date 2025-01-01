// File: src/models/Coupon.ts
import  { Schema, model, models } from "mongoose";

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true }, // "percentage" or "fixed"
  discountValue: { type: Number, required: true }, // E.g., 10% or $10
  validUntil: { type: Date, required: true },
  minimumOrderValue: { type: Number, default: 0 }, // E.g., $50 minimum
  usageLimit: { type: Number, default: 1 }, // Number of times it can be used
  usedCount: { type: Number, default: 0 }, // Track usage
});

export default models.Coupon || model("Coupon", CouponSchema);
