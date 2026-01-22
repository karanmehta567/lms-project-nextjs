import prisma from "@/lib/db";
import { ReqAdmin } from "./require";

export async function GetDashStats(){
    await ReqAdmin()
    // running code parallely,sync
    const [totalSignUps,totalCustomers,totalCourses,totalLessons]=await Promise.all([
        // total sign ups
        await prisma.user.count(),
        // total customers
        prisma.user.count(
            {
                where:{
                    enrollment:{
                        some:{}
                    }
                }
            }
        ),
        prisma.courses.count(),
        prisma.lesson.count()
    ])
    return {
        totalSignUps,
        totalCourses,
        totalCustomers,
        totalLessons
    }
}