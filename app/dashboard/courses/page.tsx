import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Courses(){
    return (
    <>
    <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Courses</h1>
        <Link href={'/dashboard/courses/create'} className={buttonVariants()}>Create Course</Link>
    </div>
    <div>
        <h1>Here you will see all of the courses</h1>
    </div>
    </>
    )
}