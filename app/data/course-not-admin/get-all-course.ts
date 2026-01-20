import prisma from "@/lib/db";

export async function ReturnCourses(){
    await new Promise((resolve)=>setTimeout(resolve,2000))
    const data=await prisma.courses.findMany({
        where:{
            status:'Published'
        },
        orderBy:{
            createdAt:'desc'
        },
        select:{
            title:true,
            price:true,
            description:true,
            slug:true,
            fileKey:true,
            id:true,
            level:true,
            duration:true,
            category:true
        }
    })
    return data
}
export type GetAllType=Awaited<ReturnType<typeof ReturnCourses>>[0]