import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const USerQuerySchema = z.object({
  uname: usernameValidation,
});

export async function GET(req: NextRequest) {
   
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      uname: searchParams.get("uname"),
    };
    // validate with zod
    const result = USerQuerySchema.safeParse(queryParam);
    console.log("result", result);
    if (!result.success) {
      const unameErr = result.error.format().uname?._errors || [];
      return NextResponse.json({
        success: false,
        message: unameErr,
      });
    }
    const { uname } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      uname,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return NextResponse.json({
        success: false,
        message: "uname already taken",
      });
    }
     return NextResponse.json({
        success: true,
        message: "uname is valid",
      });
  } catch (err) {
    console.log("err checking uname", err);
    return NextResponse.json({
      success: false,
      message: "err checking uname",
    });
  }
}
