import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { admin, emailOTP } from "better-auth/plugins"
import { resend } from "./resend";

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders:{
        github:{
            clientId:process.env.GITHUB_CLIENT as string,
            clientSecret:process.env.GITHUB_CLIENT_SECRET as string
        }
    },
    plugins:[
        emailOTP({
            async sendVerificationOTP({email,otp}){
                await resend.emails.send({
                    from: 'no-reply@noreplyllms.online',
                    to: [email],
                    subject: 'Verify your E-mail',
                    html:`<p>Your OTP is <strong>${otp}</strong></p>`
                });
            }
        }),
        admin()
    ]
});