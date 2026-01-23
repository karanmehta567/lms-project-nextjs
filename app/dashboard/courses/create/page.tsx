'use client'
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { CategoryType, CourseLevel, CourseStatus, ZodSchema, ZodSchemaType } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { ArrowLeft, Loader2Icon, PlusIcon, SparkleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import slugify from 'slugify'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipTapEditor } from "@/components/rich-text-editor/TipTap";
import { Uploader } from "@/components/file-upload/Uploader";
import { useTransition } from "react";
import { CreateCoursePrisma } from "./serveraction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateCourse() {
    const [StartTrasition,SetTransition]=useTransition()
    const router=useRouter()
  // Initialize form with full schema + defaults
const form = useForm<ZodSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ZodSchema) as any,
    defaultValues: {
        title: "",
        description: "",
        fileKey: "",
        price: 1,
        duration: 1,
        level: "Begineer",
        category: 'Development',
        slug: "",
        status: "Draft",
    },
});
function onSubmit(values: ZodSchemaType) {
    SetTransition(async()=>{
        try {
            const result=await CreateCoursePrisma(values)
            if(result.status=='error'){
                toast.error(result.message)
            }else{
                toast.success(result.message)
                form.reset()
                router.push('/dashboard/courses')
            }
        } catch{
            toast.error("Something went wrong")
        }
    })
}
return (
    <>
    <div className="flex items-center gap-4 mb-4">
        <Link
            href={"/dashboard/courses"}
            className={buttonVariants({ variant: "outline", size: "icon" })}
        >
        <ArrowLeft className="size-4" />
        </Link>

        <h1 className="text-2xl font-semibold">Create Course</h1>
    </div>

    <Card>
        <CardTitle className="ml-5 mt-4">Basic Information</CardTitle>
        <CardDescription className="ml-5">
            Provide basic information about the course
        </CardDescription>
        <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="title" render={({field})=>(
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Title" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <div className="flex gap-4 items-end">
                    <FormField control={form.control} name="slug" render={({field})=>(
                    <FormItem className="w-full">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                            <Input placeholder="Slug" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )}/>
                    <Button type="button" className="w-fit" onClick={()=>{
                        const titleValue=form.getValues("title")
                        const slug=slugify(titleValue)
                        form.setValue('slug',slug,{shouldValidate:true})
                    }}>Generate Slug <SparkleIcon/></Button>
                </div>
                <FormField control={form.control} name='description' render={({field})=>(
                    <FormItem className="w-full">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <TipTapEditor field={field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <FormField control={form.control} name='fileKey' render={({field})=>(
                    <FormItem className="w-full">
                        <FormLabel>ThumbNail Image</FormLabel>
                        <FormControl>
                            <Uploader value={field.value} onChange={field.onChange} fileTypeAccepted="image"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name='category' render={({field})=>(
                    <FormItem className="w-full">
                        <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder='Select Option'/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CategoryType.map((category)=>(
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage/>
                        
                    </FormItem>
                    )}/>
                    <FormField control={form.control} name='level' render={({field})=>(
                    <FormItem className="w-full">
                        <FormLabel>Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder='Select Level'/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CourseLevel.map((category)=>(
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage/>
                    </FormItem>
                    )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="duration" render={({field})=>(
                    <FormItem>
                        <FormLabel>Duration(hrs.)</FormLabel>
                        <FormControl>
                            <Input placeholder="Duration" type="number" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="price" render={({field})=>(
                    <FormItem>
                        <FormLabel>Price(INR)</FormLabel>
                        <FormControl>
                            <Input placeholder="Price" type="number" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                </div>
                <FormField control={form.control} name='status' render={({field})=>(
                    <FormItem className="w-full">
                        <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder='Select Status'/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CourseStatus.map((category)=>(
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <Button type="submit" disabled={StartTrasition}>
                    {
                        StartTrasition?(
                            <>
                            <p>Creating....</p>
                            <Loader2Icon className="size-4 ml-1"/>
                            </>
                        ):(
                            <>
                            Create Course <PlusIcon className="ml-1" size={16}/>
                            </>
                        )
                    }
                </Button>
            </form>
        </Form>
        </CardContent>
    </Card>
    </>
);
}
