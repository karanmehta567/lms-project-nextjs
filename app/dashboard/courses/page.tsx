import { GetCourses } from "@/app/data/user/Courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminLayout from "./_components/AdminComponent";
import GeneralLayout from "@/components/general/GeneralLayout";

export default async function Courses(){
    const courses=await GetCourses();
    return (
        <>
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Your Courses</h1>
            <Link href={'/dashboard/courses/create'} className={buttonVariants()}>Create Course</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
            {
                courses.length===0?(
                    <GeneralLayout title="No course found"
                    description="Create a new course to get started"
                    buttonText="Create Course"/>
                ):(
                    <>
                    {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        courses.map((course:any)=>(
                            <AdminLayout data={course} key={course.id}/>
                        ))
                    }
                    </>
                )
            }
        </div>
        </>
    )
}