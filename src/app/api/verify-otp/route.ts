import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { uname, code } = await req.json();
    const u = await UserModel.findOne({ uname });
    if (!u) {
      return NextResponse.json({
        success: false,
        message: "user not found",
      });
    }
    const isCodeExpired = new Date(u.verifyCodeExpiry) < new Date();
    if (u.verifyCode === code && !isCodeExpired) {
      u.isVerified = true;
      await u.save();
      return NextResponse.json({
        success: true,
        message: "User verified successfully",
      });
    } else if (u.verifyCode !== code) {
      return NextResponse.json({
        success: false,
        message: "incorrect code",
      });
    } else if (isCodeExpired) {
      return NextResponse.json({
        success: false,
        message: "verification code expiried",
      });
    }
  } catch (err) {
    console.log("err in verify code", err);
    return NextResponse.json({
      success: false,
      message: "err in verify code",
    });
  }
}
