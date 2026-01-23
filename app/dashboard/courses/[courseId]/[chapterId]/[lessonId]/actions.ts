"use server"

import { ReqAdmin } from "@/app/data/user/require"
import prisma from "@/lib/db"
import { APIResponse } from "@/lib/types"
import { LessonSchema, LessonSchemaType } from "@/lib/zodSchema"

export async function UpdateLesson(values:LessonSchemaType,lessonId:string):Promise<APIResponse>{
    await ReqAdmin()
    try {
        const result=LessonSchema.safeParse(values)
        if(!result.success){
            return {
                status:'error',
                message:'Invalid data'
            }
        }
        await prisma.lesson.update({
            where:{
                id:lessonId
            },
            data:{
                title:result.data.name,
                description:result.data.description,
                thumbnailKey:result.data.thumbnailKey,
                videoKey:result.data.videoKey
            }
        })
        return {
            status:'success',
            message:'Succesfully updated course!'
        }
    } catch{
        return {
            status:'error',
            message:'Failed to update'
        }
    }
}