import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { uname, email, password } = await req.json();
    const existingUserVerifiedbyUname = await UserModel.findOne({
      uname,
      isVerified: true,
    });

    if (existingUserVerifiedbyUname) {
      return NextResponse.json({
        success: false,
        message: "User already exists",
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json({
          success: false,
          message: "User with this email already exists",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verificationCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        uname,
        email,
        password: hashedPassword,
        verifyCode: verificationCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }
    const emailResponse = await sendVerificationEmail(
      email,
      uname,
      verificationCode
    );
    if (!emailResponse.success) {
      return NextResponse.json({
        success: false,
        message: emailResponse.message,
      });
    }
    return NextResponse.json({
      success: true,
      message: "user registered successfully, please verify your email",
    });
  } catch (err) {
    console.log("err in signup : ", err);
    return NextResponse.json({
      success: false,
      message: "error in signup",
    });
  }
}
