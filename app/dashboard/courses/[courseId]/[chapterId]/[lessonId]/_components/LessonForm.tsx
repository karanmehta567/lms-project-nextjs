"use client"

import { AdminGetLessontype } from "@/app/data/user/get-lesson"
import { Uploader } from "@/components/file-upload/Uploader";
import { TipTapEditor } from "@/components/rich-text-editor/TipTap";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { UpdateLesson } from "../actions";
import { toast } from "sonner";

interface IAppProps{
    data:AdminGetLessontype;
    chapterId:string,
    courseId:string,
}
export function LessonForm({chapterId,data,courseId}:IAppProps){
    const [StartTrasition,SetTransition]=useTransition()
    const form = useForm<LessonSchemaType>({
            resolver: zodResolver(LessonSchema),
            defaultValues: {
                name:data.title,
                chapterId:chapterId,
                courseId:courseId,
                description:data.description ?? undefined,
                videoKey:data.videoKey ?? 'undefined',
                thumbnailKey:data.thumbnailKey?? undefined
            },
    });
    function onSubmit(values: LessonSchemaType) {
        SetTransition(async()=>{
            try {
                const result=await UpdateLesson(values,data.id)
                if(result.status==='error'){
                    toast.error(result.message)
                }else{
                    toast.success(result.message)
                }
            } catch{
                toast.error("Something went wrong")
            }
        })
    }
    return (
        <div>
            <Link href={`/dashboard/courses/${courseId}/edit`} className={buttonVariants({
                variant:'outline',
                className:'mb-6'
            })}>
                <ArrowLeft className="size-4"/>
                <span>Go Back</span>
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>Configure the video and description for this lesson.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name="name" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Lesson Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lesson Name..." {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="description" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <TipTapEditor field={field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="thumbnailKey" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Thumbnail Image
                                    </FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted='video'/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="videoKey" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Video
                                    </FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <Button  disabled={StartTrasition} type="submit">
                                {StartTrasition?(
                                    "Saving..."
                                ):(
                                    "Save Lesson"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}