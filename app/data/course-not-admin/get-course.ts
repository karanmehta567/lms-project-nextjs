import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export async function GetCourseWithChapLesson(slug:string){
    const course=await prisma.courses.findUnique({
        where:{
            slug:slug
        },
        select:{
            id:true,
            title:true,
            fileKey:true,
            duration:true,
            level:true,
            category:true,
            price:true,
            description:true,
            chapter:{
                select:{
                    id:true,
                    title:true,
                    lessons:{
                        select:{
                            id:true,
                            title:true
                        },
                        orderBy:{
                            position:'asc'
                        }
                    }
                },
                orderBy:{
                    position:"asc"
                }
            }
        }
    })
    if(!course){
        return notFound()
    }
    return course
}