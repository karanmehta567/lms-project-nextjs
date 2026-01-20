import prisma from "@/lib/db";
import { ReqAdmin } from "./require";
import { notFound } from "next/navigation";

export async function AdminGetLesson(id:string){
    await ReqAdmin();
    const data=await prisma.lesson.findUnique({
        where:{
            id:id
        },
        select:{
            title:true,
            videoKey:true,
            description:true,
            id:true,
            position:true,
            thumbnailKey:true
        }
    })
    if(!data){
        return notFound();
    }
    return data;
}
export type AdminGetLessontype=Awaited<ReturnType<typeof AdminGetLesson>>