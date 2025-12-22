import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateChapter, CreateLesson } from "@/lib/edit";
import { LessonSchema, LessonSchemaType} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewLessonModel({courseId,chapterId}:{courseId:string,chapterId:string}){
    const [isOpen,setOpen]=useState(false)
    const [StartTransition,SetTransition]=useTransition()
    const router=useRouter()
    function handleOpenChange(open:boolean){
        if(!isOpen){
            form.reset()
        }
        setOpen(open)
    }
    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(LessonSchema) as any,
        defaultValues: {
            name:'',
            courseId:courseId,
            chapterId:chapterId
        },
    });
    async function onSubmit(values:LessonSchemaType){
        SetTransition(async()=>{
            try {
                const {status,message}=await CreateLesson(values)
                if(status==='error'){
                    toast.error("Failed to create lesson")
                    return;
                }
                if(status=='success'){
                    toast.success("Created lesson succesfully!")
                    form.reset()
                    router.refresh()
                    setOpen(false)
                }
            } catch (error) {
                toast.error("Could not create lesson,try again")
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant='outline' className="w-full justify-center gap-1 rounded-sm">
                    <PlusIcon className="size-4"/>New Lesson
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>
                        Create new lesson
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name your lesson?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form action="" className="space-y-8 " onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Lesson Name..." {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}></FormField>
                        <DialogFooter>
                            <Button type="submit" disabled={StartTransition}>
                                {StartTransition?'Saving...':'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}