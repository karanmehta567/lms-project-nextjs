import { AdminCourseType } from "@/app/data/user/Courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useImageHook from "@/hooks/use-construct";
import { ArrowLeft, DeleteIcon, EyeIcon, MoreVertical, PencilIcon, School2Icon, TimerIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IAppProps{
    data:AdminCourseType
}
export default function AdminLayout({data}:IAppProps){
    const parsed = JSON.parse(data.description);
    const descriptionText = parsed.content?.[0]?.content?.[0]?.text ?? "";
    const thumbailUrl=useImageHook(data.fileKey )
    console.log('thumbail url',thumbailUrl)
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size='icon' variant='outline' className="dark:bg-white">
                            <MoreVertical className="size-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 max-h-60 overflow-y-auto">
                        <DropdownMenuItem asChild>
                            <Link href={'/dashboard/courses/${data.id}/edit'}>
                                <PencilIcon className="size-4 mr-2"/>Edit Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={'/dashboard/courses/${data.slug}'}>
                                <EyeIcon className="size-4 mr-2"/>Preview Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={'/dashboard/courses/${data.id}/delete'}>
                                <TrashIcon className="size-4 mr-2 text-destructive dark:text-red-600"/>Delete Course
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Image src={thumbailUrl} alt='Thumbnail URL....' width={600} height={300} className="w-full rounded-t-lg aspect-video h-full object-cover"/>
            <CardContent className="p-4">
                <Link href={`/dashboard/courses/${data.id}/edit`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors">{data.title}</Link>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight">{descriptionText}</p>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-2">
                        <TimerIcon className="size-8 p-1 rounded-md text-primary bg-primary/10"/>
                        <p className="text-md text-muted-foreground">{data.duration}h</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <School2Icon className="size-8 p-1 rounded-md text-primary bg-primary/10"/>
                        <p className="text-md text-muted-foreground">{data.level}</p>
                    </div>
                </div>
                <Link href={`/dashboard/courses/${data.id}/edit`} className={buttonVariants({
                    className:'w-full mt-3'
                })}>
                <ArrowLeft className="size-4 gap-x-2"/>Edit Course
                </Link>
            </CardContent>
        </Card>
    )
}
// https://lms-nextjs-karan.t3.storage.dev/29150e80-84eb-4157-8423-bd7b27ee76d5-badge-690d98e8000abd893721f10a.png