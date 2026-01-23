import prisma from "@/lib/db";
import { ReqAdmin } from "./require";

export async function GetCourses(){
    const session=await ReqAdmin();
    const data=await prisma.courses.findMany({
        where:{
            UserId:session.user.id
        },
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