import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "./resend";


export async function sendVerificationEmail(email:string,uname:string,verificationCode:string):Promise<ApiResponse> {
    try{
 const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'TryMessage : Verification Code',
      react: VerificationEmail({uname:uname,otp:verificationCode}),
    });
        return {success:true,message:'verification email sent successfully'}
    }catch(err){
        console.log('verification Email sending err', err)
        return {success:false,message:'faled to send verification mail'}
    }
}