import { GetCourseWithChapLesson } from "@/app/data/course-not-admin/get-course";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { IconBook, IconCategory, IconCertificate, IconChartBar, IconChevronDown, IconClock, IconDeviceMobile, IconPlayerPlay } from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { UserAlreadyEnrolled } from "@/app/data/user/user-enrolled-already-course";
import Link from "next/link";
import EnrollNow from "./_components/EnrollNow";

type Params=Promise<{slug:string}>

export default async function SlugPage({params}:{params:Params}){
    const {slug}=await params
    const course=await GetCourseWithChapLesson(slug)
    const checkIfAlreadyBroughtCourse=await UserAlreadyEnrolled(course.id)
    let descriptionText = ""
        try {
            const parsed = JSON.parse(course.description)
            descriptionText = parsed?.content?.[0]?.content?.[0]?.text ?? ""
        } catch (e) {
        // fallback when description is HTML
            descriptionText = course.description.replace(/<[^>]*>/g, "")
        }
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
            <div className="order-1 lg:col-span-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow">
                    <Image alt="image" src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.t3.storage.dev/${course.fileKey}`} priority fill className="object-cover"/>
                    <div className="absolute inset-0">
                    </div>
                </div>
                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">{descriptionText}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <IconChartBar className="size-4"/>
                            <span>{course.level}</span>
                        </Badge>
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <IconCategory className="size-4"/>
                            <span>{course.category}</span>
                        </Badge>
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <IconClock className="size-4"/>
                            <span>{course.duration} {course.duration>1?'hours':'hour'}</span>
                        </Badge>
                    </div>
                    <Separator className="my-8"/>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Course Description
                        </h2>
                        <p>{descriptionText}</p>
                    </div>
                    <div className="mt-12 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-semibold tracking-tight">
                                Course Content
                            </h2>
                            <div>
                                {course.chapter.length} chapters | {course.chapter.reduce((total,chapter)=>total+chapter.lessons.length,0)||0} Lessons
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {course.chapter.map((chapter,index)=>(
                            <Collapsible key={chapter.id} defaultOpen={index===0}>
                                <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                                    <CollapsibleTrigger>
                                        <div>
                                            <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">{index+1}</p>
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-left">{chapter.title}</h3>
                                                            <p className="text-sm text-muted-foreground mt-1 text-left" >{chapter.lessons.length} {chapter.lessons.length>1?'lessons':' lesson'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-3">
                                                        <Badge variant={'outline'} className="text-xs">
                                                            {chapter.lessons.length}{chapter.lessons.length>1?' lessons':' lesson'}    
                                                        </Badge>
                                                        <IconChevronDown className="size-5 text-muted-foreground"/>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="border-t bg-muted/20">
                                            <div className="p-6 pt-4 space-y-4">
                                                {chapter.lessons.map((chapter,index)=>(
                                                    <div key={chapter.id} className="flex items-center p-3 gap-4 rounded-lg hover:bg-accent transition-colors">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                                                            <IconPlayerPlay className="text-muted-foreground items-center size-4 group-hover:text-primary transition-colors"/>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm">
                                                                <p>{chapter.title}</p>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-1">Lesson {index+1}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))}
                    </div>
                </div>
            </div>
            {/* Enrollment Card */}
            <div className="order-2 lg:col-span-1">
                <div className="sticky top-20">
                        <Card className="py-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-medium">Price</span>
                                    <span className="text-2xl font-bold text-primary">{new Intl.NumberFormat("en-US",{
                                        style:'currency',
                                        currency:'INR'
                                    }).format(course.price)}</span>
                                </div>
                                <div className="mb-6 space-y-5 rounded-md bg-primary/10 p-4">
                                    <h4 className="font-medium">What you will get:</h4>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex rounded-full size-8 items-center justify-center bg-primary/10 text-primary">
                                                <IconClock className="size-4"/>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">Course Duration</h4>
                                                <p className="text-muted-foreground text-sm">{course.duration} {course.duration>1?'hours':'hour'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex rounded-full size-8 items-center justify-center bg-primary/10 text-primary">
                                                <IconChartBar className="size-4"/>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">Difficulty Level</h4>
                                                <p className="text-muted-foreground text-sm">{course.level}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex rounded-full size-8 items-center justify-center bg-primary/10 text-primary">
                                                <IconCategory className="size-4"/>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">Category</h4>
                                                <p className="text-muted-foreground text-sm">{course.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex rounded-full size-8 items-center justify-center bg-primary/10 text-primary">
                                                <IconBook className="size-4"/>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">Lessons Included</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    {course.chapter.reduce((total,chapter)=>total+chapter.lessons.length,0)||0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3 space-y-3">
                                    <h4>This course includes:</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-sm">
                                            <div className="rounded-full bg-green-500/10 p-1 hover:text-green-500 hover:transition-colors">
                                                <CheckIcon className="size-4"/>
                                            </div>
                                            <span>Full Lifetime access</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <div className="rounded-full bg-green-500/10 p-1">
                                                <IconDeviceMobile className="size-4"/>
                                            </div>
                                            <span>Access on mobile and laptop</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <div className="rounded-full bg-green-500/10 p-1">
                                                <IconCertificate className="size-4"/>
                                            </div>
                                            <span>Certificate of achievement</span>
                                        </li>
                                    </ul>
                                </div>
                                {checkIfAlreadyBroughtCourse?(
                                    <Link href={'/dashboard'}>
                                        Watch Now
                                    </Link>
                                ):(
                                    <EnrollNow courseId={course.id}/>
                                )}
                                <p className="text-muted-foreground text-sm hover:text-md text-clip mt-3 flex items-center justify-center ">30 days money back guarantee!</p>
                            </CardContent>
                        </Card>
                </div>
            </div>
        </div>
    )
}