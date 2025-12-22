import { AdminGetCourse } from "@/app/data/user/one-course"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditCourseForm from "./_components/EditCourse"
import CourseStrcture from "./_components/CourseStructure"
type Params=Promise<{courseId:string}>

export default async function CourseEdit({params}:{params:Params}){
    
    const {courseId}=await params
    const data=await AdminGetCourse(courseId)
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Edit Course : <span className="text-primary underline">{data?.title}</span>
            </h1>
            <Tabs defaultValue="" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="basic-info" className="dark:hover:bg-black">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-struc" className="dark:hover:bg-black">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Basic Info
                            </CardTitle>
                            <CardDescription>
                                Edit your course information
                            </CardDescription> 
                        </CardHeader>
                        <EditCourseForm data={data}/>
                    </Card>
                </TabsContent>
                <TabsContent value="course-struc">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Course Structure
                            </CardTitle>
                            <CardDescription>
                                Here you can edit your course structure
                            </CardDescription> 
                        </CardHeader>
                        <CourseStrcture data={data}/>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}