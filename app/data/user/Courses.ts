import prisma from "@/lib/db";
import { ReqAdmin } from "./require";

export async function GetCourses(){
    await ReqAdmin();
    const data=await prisma.courses.findMany({
        orderBy:{
            createdAt:'desc'
        },
        select:{
            id:true,
            slug:true,
            duration:true,
            level:true,
            status:true,
            price:true,
            title:true,
            fileKey:true,
            description:true
        }
    })
    return data;
}
export type AdminCourseType=Awaited<ReturnType<typeof GetCourses>>[0]