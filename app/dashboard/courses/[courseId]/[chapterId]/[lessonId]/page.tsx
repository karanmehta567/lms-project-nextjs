import { AdminGetLesson } from "@/app/data/user/get-lesson"
import { LessonForm } from "./_components/LessonForm"

type Params=Promise<{
    courseId:string,
    chapterId:string,
    lessonId:string
}>
export default async function LessonIdPage({params}:{params:Params}){
    const {courseId,chapterId,lessonId}=await params
    const lesson=await AdminGetLesson(lessonId)
    
    return (
        <LessonForm chapterId={chapterId} data={lesson} courseId={courseId} />
    )
}