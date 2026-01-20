"use client"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { EnrollInCourseAction } from "../action"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"

export default function EnrollNow({courseId}:{courseId:string}){
    const [StartTransition,SetTransition]=useTransition()
    function onSubmit(){
        SetTransition(async()=>{
            const {status,message}=await EnrollInCourseAction(courseId)
            if(status=='error'){
                toast.error(message)
                return
            }
            else{
                toast.success(message)
            }
        })
    }
    return (
        <Button className="w-full" onClick={onSubmit} disabled={StartTransition}>
            {StartTransition?(<><Loader2Icon className="size-4 animate-spin"/>Loading...</>):(<>Enroll Now</>)}
        </Button>
    )
}