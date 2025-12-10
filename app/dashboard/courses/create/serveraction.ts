"use server"
import { ReqAdmin } from "@/app/data/user/require"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import prisma from "@/lib/db"
import { APIResponse } from "@/lib/types"
import { ZodSchema, ZodSchemaType } from "@/lib/zodSchema"
import { request } from "@arcjet/next"

export const arcjetRule=arcjet.withRule(
    detectBot({
        mode:'LIVE',
        allow:[]
    })
).withRule(
    fixedWindow({
        mode:'LIVE',
        window:'1m',
        max:5
    })
)
export async function CreateCoursePrisma(value:ZodSchemaType):Promise<APIResponse>{
    const session=await ReqAdmin();
    try {
        const req=await request()
        const decision=await arcjetRule.protect(req,{
            fingerprint:session?.user?.id
        })
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return {
                    status:"error",
                    message:'Rate Limiting is not appreciated!'
                }
            }else{
                return {
                    status:"error",
                    message:'Website is protected from Bots!'
                }
            }
        }
        const validations=ZodSchema.safeParse(value)
        if(!validations.success){
            return{
                status:"error",
                message:"Invalid Form Data"
            }
        }
        const data=await prisma.courses.create({
            data:{
                ...validations.data,
                UserId:session?.user?.id
            }
        })
        return {
            status:'success',
            message:'Course Created!'
        }
    } catch (error) {
        return {
            status:'error',
            message:'An Error occured while submitting form'
        }
    }
}