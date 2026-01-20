'use client'
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useTransition } from "react";
import { DeleteCourse } from "./action";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, Trash2Icon } from "lucide-react";

export default function DeleteCourseRoute(){
    const [StartTrasition,SetTransition]=useTransition()
    const {courseId}=useParams<{courseId:string}>()
    const router=useRouter();

    function onSubmit() {
        SetTransition(async()=>{
            try {
                const result=await DeleteCourse(courseId)
                if(result.status==='error'){
                    toast.error(result.message)
                }else{
                    toast.success(result.message)
                    router.push('/dashboard/courses')
                }
            } catch (error) {
                console.log(error)
                toast.error("Something went wrong")
            }
        })
    }
    return (
        <div className="max-w-xl mx-auto w-full">
            <Card className="mt-32">
                <CardHeader>
                    <CardTitle>Are you sure you want to delete the course?</CardTitle>
                    <CardDescription>This action cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Link href={'/dashboard/courses'} className={buttonVariants()}>Cancel</Link>
                    <Button variant="destructive" type="submit"  className="flex items-center justify-center hover:bg-red-500" onClick={onSubmit} disabled={StartTrasition}>
                        {
                            StartTrasition?(
                                <>
                                    <Loader2Icon className="animate-spin size-4"/>
                                    Deleting....
                                </>
                            ):(
                                <>
                                    <Trash2Icon className="size-4"/>
                                    Delete
                                </>
                            )
                        }
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}