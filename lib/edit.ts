'use server'
import { ReqAdmin } from '@/app/data/user/require'
import prisma from '@/lib/db';
import { APIResponse } from '@/lib/types';
import { ChapterSchema, ChapterSchmeaType, LessonSchema, LessonSchemaType, ZodSchema, ZodSchemaType } from '@/lib/zodSchema';
import { arcjetRule } from './arcjet-rule';
import { request } from '@arcjet/next';
import { revalidatePath } from 'next/cache';

type ChapterReorderPayload = {
    type: 'chapter'
    courseId: string
    items: {
        id: string
        order: number
    }[]
}

type LessonReorderPayload = {
    type: 'lesson'
    chapterId: string
    items: {
        id: string
        order: number
    }[]
}

type ReorderPayload = ChapterReorderPayload | LessonReorderPayload
export async function EditCoursePrisma(data:ZodSchemaType,courseId:string):Promise<APIResponse>{
    const GetAdminSession=await ReqAdmin();
    try {
        const req=await request()
        const decision=await arcjetRule.protect(req,{
            fingerprint:GetAdminSession.user.id
        })
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return {
                    status:"error",
                    message:"You have been blocked for rate limiting"
                }
            }else{
                return {
                    status:"error",
                    message:"You have been blocked for bot purposes"
                }
            }
        }
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
    } catch {
        return {
            status:'error',
            message:'Failed to update course'
        }
    }
}
export async function ReorderCourseStructurePrisma(
    payload: ReorderPayload
    ): Promise<APIResponse> {
    const adminSession = await ReqAdmin()

    try {
        /* ---------- ARCJET PROTECTION ---------- */
        const req = await request()
        const decision = await arcjetRule.protect(req, {
        fingerprint: adminSession.user.id,
        })

        if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return {
            status: 'error',
            message: 'Too many reorder requests. Slow down.',
            }
        }
        return {
            status: 'error',
            message: 'Request blocked',
        }
        }

        /* ---------- CHAPTER REORDER ---------- */
        if (payload.type === 'chapter') {
        const { courseId, items } = payload

        if (!courseId || !Array.isArray(items)) {
                return {
                status: 'error',
                message: 'Invalid chapter reorder payload',
                }
        }

        await prisma.$transaction(
            items.map(item =>
            prisma.chapter.update({
                where: {
                id: item.id,
                courseId, // safety guard
                },
                data: {
                position: item.order,
                },
            })
            )
        )

        return {
            status: 'success',
            message: 'Chapters reordered successfully',
        }
        }

        /* ---------- LESSON REORDER ---------- */
        if (payload.type === 'lesson') {
        const { chapterId, items } = payload

        if (!chapterId || !Array.isArray(items)) {
            return {
            status: 'error',
            message: 'Invalid lesson reorder payload',
            }
        }

        await prisma.$transaction(
            items.map(item =>
            prisma.lesson.update({
                where: {
                id: item.id,
                chapterId, // safety guard
                },
                data: {
                position: item.order,
                },
            })
            )
        )

        return {
            status: 'success',
            message: 'Lessons reordered successfully',
        }
        }

        return {
        status: 'error',
        message: 'Invalid reorder type',
        }
    } catch (error) {
        console.error('REORDER_ERROR:', error)
        return {
        status: 'error',
        message: 'Failed to reorder course structure',
        }
    }
}
export async function DeleteChapterPrisma(chapterId:string ,courseId:string):Promise<APIResponse>{
    await ReqAdmin()
    try {
        const coursewithChapter=await prisma.courses.findUnique({
            where:{
                id:courseId
            },
            select:{
                chapter:{
                    orderBy:{
                        position:'asc'
                    },
                    select:{
                        id:true,
                        position:true
                    }
                }
            }
        })
        if(!coursewithChapter){
            return {
                status:'error',
                message:'Failed to get course-id'
            }
        }
        const chapter=coursewithChapter.chapter
        const chapter2Delete=chapter.find((chapter)=>chapter.id===chapterId)
        if(!chapter2Delete){
            return {
                status:'error',
                message:'Chapter not found'
            }
        }
        const remainingChapter=chapter.filter((chapter)=>chapter.id!==chapterId)
        const updatedChapter=remainingChapter.map((chapter,index)=>{
            return prisma.chapter.update({
                where:{
                    id:chapter.id
                },
                data:{
                    position:index+1
                }
            })
        })
        await prisma.$transaction([
            ...updatedChapter,
            prisma.chapter.delete({
                where:{
                    id:chapterId,
                }
            })
        ])
        revalidatePath(`/dashboard/courses/${courseId}/edit`)
        return {
            status:'success',
            message:'Deleted'
        }
    } catch {
        return { 
            status:'error',
            message:'Failed to delete chapter'
        }
    }
}
export async function DeleteLessonPrisma(chapterId:string ,courseId:string,lessonId:string):Promise<APIResponse>{
    await ReqAdmin()
    try {
        const chapterwithLessons=await prisma.chapter.findUnique({
            where:{
                id:chapterId
            },
            select:{
                lessons:{
                    orderBy:{
                        position:'asc'
                    },
                    select:{
                        id:true,
                        position:true
                    }
                }
            }
        })
        if(!chapterwithLessons){
            return {
                status:'error',
                message:'Failed to get chapter-id'
            }
        }
        const lessons=chapterwithLessons.lessons
        const lessonToDelete=lessons.find((lesson)=>lesson.id===lessonId)
        if(!lessonToDelete){
            return {
                status:'error',
                message:'Lesosn not found'
            }
        }
        const remainingLesson=lessons.filter((lesson)=>lesson.id!==lessonId)
        const updatedLesson=remainingLesson.map((lesson,index)=>{
            return prisma.lesson.update({
                where:{
                    id:lesson.id
                },
                data:{
                    position:index+1
                }
            })
        })
        await prisma.$transaction([
            ...updatedLesson,
            prisma.lesson.delete({
                where:{
                    id:lessonId,
                    chapterId:chapterId
                }
            })
        ])
        revalidatePath(`/dashboard/courses/${courseId}/edit`)
        return {
            status:'success',
            message:'Deleted'
        }
    } catch{
        return { 
            status:'error',
            message:'Failed to delete lesson'
        }
    }
}
export async function CreateLesson(values:LessonSchemaType):Promise<APIResponse>{
    await ReqAdmin()
    try {
        const result=LessonSchema.safeParse(values)
        if(!result.success){
            return {
                status:'error',
                message:'Invalid data'
            }
        }
        await prisma.$transaction(async(tx)=>{
            const maxPos=await tx.lesson.findFirst({
                where:{
                    chapterId:result.data.chapterId
                },
                select:{
                    position:true
                },
                orderBy:{
                    position:'desc'
                }
            })
            await tx.lesson.create({
                data:{
                    title:result.data.name,
                    description:result.data.description,
                    videoKey:result.data.videoKey,
                    thumbnailKey:result.data.thumbnailKey,
                    chapterId:result.data.chapterId,
                    position:(maxPos?.position??0)+1
                }
            })
        })
        revalidatePath(`/dashboard/courses/${result.data.courseId}`)
        revalidatePath(`/dashboard/courses/${result.data.courseId}/edit`)
        return {
            status:'success',
            message:'Lesson Created Succesfully'
        }
    } catch{
        return {
            status:'error',
            message:'Failed to create Lesson'
        }
    }
}
export async function CreateChapter(values:ChapterSchmeaType):Promise<APIResponse>{
    await ReqAdmin()
    try {
        const result=ChapterSchema.safeParse(values)
        if(!result.success){
            return {
                status:'error',
                message:'Invalid data'
            }
        }
        await prisma.$transaction(async(tx)=>{
            const maxPos=await tx.chapter.findFirst({
                where:{
                    courseId:result.data.courseId
                },
                select:{
                    position:true
                },
                orderBy:{
                    position:'desc'
                }
            })
            await tx.chapter.create({
                data:{
                    title:result.data.name,
                    courseId:result.data.courseId,
                    position:(maxPos?.position??0)+1
                }
            })
        })
        revalidatePath(`/dashboard/courses/${result.data.courseId}`)
        revalidatePath(`/dashboard/courses/${result.data.courseId}/edit`)
        return {
            status:'success',
            message:'Chapter Created Succesfully'
        }
    } catch{
        return {
            status:'error',
            message:'Failed to create chapter'
        }
    }
}