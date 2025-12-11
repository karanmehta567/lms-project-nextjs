import "server-only"
import { ReqAdmin } from "./require"
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export async function AdminGetCourse(id:string){
    await ReqAdmin();
    const data=await prisma.courses.findUnique({
        where:{
            id:id
        },
        select:{
            id:true,
            title:true,
            description:true,
            fileKey:true,
            price:true,
            duration:true,
            level:true,
            status:true,
            slug:true,
            category:true
        }
    })
    if(!data){
        notFound()
    }
    return data;
}
export type AdminCorseType=Awaited<ReturnType<typeof AdminGetCourse>>