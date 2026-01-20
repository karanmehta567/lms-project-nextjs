import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export async function UserAlreadyEnrolled(courseId:string):Promise<boolean>{
    const session=await auth.api.getSession({
        headers:await headers()
    })
    if(!session?.user){
        return false
    }
    const enrollemt=await prisma.enrollment.findUnique({
        where:{
            userId_courseId:{
                courseId:courseId,
                userId:session.user.id
            }
        },
        select:{
            status:true
        }
    })
    return enrollemt?.status=='Active'?true:false
}