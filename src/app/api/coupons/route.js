import { connectToDB } from "@/db";
import Coupon from "@/models/couponModel";

export async function POST(req) {
  await connectToDB();
  const {
    code,
    discountType,
    discountValue,
    validUntil,
    minimumOrderValue,
    usageLimit,
  } = await req.json();
  try {
    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      validUntil,
      minimumOrderValue,
      usageLimit,
    });
    await newCoupon.save();
    return new Response(JSON.stringify(newCoupon), { status: 201 });
  } catch (error) {
    console.error("Error saving coupon:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create coupon", error }),
      { status: 400 }
    );
  }
}

// For fetching coupons (GET request)
export async function GET(req) {
  await connectToDB();

  try {
    const coupons = await Coupon.find();
    return new Response(JSON.stringify(coupons), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch coupons" }), {
      status: 400,
    });
  }
}

// Updates coupon usage count if valid, not expired, and usage limit not reached.
export async function PATCH(req) {
  await connectToDB();
  const { code } = await req.json();

  if (!code) {
    return new Response(JSON.stringify({ error: "Coupon code is required" }), {
      status: 400,
    });
  }

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return new Response(JSON.stringify({ error: "Coupon not found" }), {
        status: 404,
      });
    }

    if (new Date(coupon.validUntil) < new Date()) {
      return new Response(JSON.stringify({ error: "Coupon has expired" }), {
        status: 400,
      });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return new Response(
        JSON.stringify({ error: "Coupon usage limit reached" }),
        { status: 400 }
      );
    }

    coupon.usedCount += 1;
    await coupon.save();
    return new Response(JSON.stringify(coupon), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to update coupon",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
