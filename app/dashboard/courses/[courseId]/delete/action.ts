"use server"
import { ReqAdmin } from "@/app/data/user/require"
import { ReqAction } from "@/app/data/user/require-action";
import arcjet, {fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const arcjetRule=arcjet.withRule(
    fixedWindow({
        mode:'LIVE',
        window:'1m',
        max:5
}))
export async function DeleteCourse(courseId:string):Promise<APIResponse>{
    const session=await ReqAction();
    try {
        const req=await request()
        const decision=await arcjetRule.protect(req,{
            fingerprint:session?.user?.id as any
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
        await prisma.courses.delete({
            where:{
                id:courseId
            }
        })
        revalidatePath("/dashboard/courses")
        return {
            status:'success',
            message:'Deleted succesfully!'
        }
    } catch{
        return {
            status:'error',
            message:'Failed to delete course'
        }
    }
}