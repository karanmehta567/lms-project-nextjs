'use server'
import { ReqAdmin } from '@/app/data/user/require'
import prisma from '@/lib/db';
import { APIResponse } from '@/lib/types';
import { ZodSchema, ZodSchemaType } from '@/lib/zodSchema';

export async function EditCoursePrisma(data:ZodSchemaType,courseId:string):Promise<APIResponse>{
    const GetAdminSession=await ReqAdmin();
    try {
        const result=ZodSchema.safeParse(data)
        if(!result){
            return {
                status:'error',
                message:'Invalid Data'
            }
        }
        await prisma.courses.update({
            where:{
                id:courseId,
                UserId:GetAdminSession.user.id
            },
            data:{
                ...result.data
            }
        })
        return {
            status:'success',
            message:'Course Edited!'
        }
    } catch (error) {
        return {
            status:'error',
            message:'Failed to update course'
        }
    }
}