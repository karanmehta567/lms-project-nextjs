"use server"
import { ReqAdmin } from "@/app/data/user/require"
import { arcjetRule } from "@/lib/arcjet-rule"
import prisma from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { APIResponse } from "@/lib/types"
import { ZodSchema, ZodSchemaType } from "@/lib/zodSchema"
import { request } from "@arcjet/next"

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
        const data=await stripe.products.create({
            name:validations.data.title,
            description:validations.data.description,
            default_price_data:{
                currency:'inr',
                unit_amount:validations.data.price * 100
            }
        })
        await prisma.courses.create({
            data:{
                ...validations.data,
                UserId:session?.user?.id,
                stripePriceId:data.default_price as string
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