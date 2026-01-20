import { GetAllType } from "@/app/data/course-not-admin/get-all-course";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useImageHook from "@/hooks/use-construct";
import { IconCategory } from "@tabler/icons-react";
import { TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IAppProps{
    data:GetAllType
}
export function PublicCourseCart({data}:IAppProps){
    let descriptionText = ""
    try {
        const parsed = JSON.parse(data.description)
        descriptionText = parsed?.content?.[0]?.content?.[0]?.text ?? ""
    } catch (e) {
    // fallback when description is HTML
        descriptionText = data.description.replace(/<[^>]*>/g, "")
    }
    const thumnailUrl=useImageHook(data.fileKey)
    return(
        <Card className="group relative py-0 gap-0">
            <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>
            <Image src={thumnailUrl} alt="Thumnail Image for course" height={400} width={600} className="w-full rounded-xl aspect-video h-full object-cover"/>
            <CardContent className="p-4">
                <Link className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors" href={`/courses/${data.slug}`}>{data.title}</Link>
                <p className="line-clamp-2 text-sm mt-2 text-muted-foreground leading-tight">{descriptionText}</p>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10 "/>
                        <p className="text-muted-foreground text-sm">{data.duration} {data?.duration>1?'hrs.':'hr.'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconCategory className="size-6 p-1 rounded-md text-primary bg-primary/10 "/>
                        <p className="text-muted-foreground text-sm">{data.category}</p>
                    </div>
                </div>
                <div>
                    <Link href={`/courses/${data.slug}`} className={buttonVariants({
                        className:'w-full mt-4'
                    })}>Learn More</Link>
                </div>
            </CardContent>
        </Card>
    )
}
export function PublicCourseSkeleton(){
    return(
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10 flex items-center">
                <Skeleton className="h-6 w-20 rounded-full "/>
            </div>
            <div className="w-full relative h-fit">
                <Skeleton className="h-6 w-20 rounded-full "/>
            </div>
            <div className="w-full relative h-fit">
                <Skeleton className="w-full rounded-t-xl aspect-video "/>
            </div>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-full"/>
                    <Skeleton className="h-6 w-3/4"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-2/3"/>
                </div>
                <div className="mt-4 flex items-center gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md"/>
                        <Skeleton className="h-4 w-8"/>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md"/>
                        <Skeleton className="h-4 w-8"/>
                    </div>
                </div>
                <Skeleton className="mt-4 w-full h-10 rounded-md"/>
            </CardContent>
        </Card>
    )
}