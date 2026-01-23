import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateChapter } from "@/lib/edit";
import { ChapterSchema, ChapterSchmeaType} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewChapterModel({courseId}:{courseId:string}){
    const [isOpen,setOpen]=useState(false)
    const [StartTransition,SetTransition]=useTransition()
    const router=useRouter()
    function handleOpenChange(open:boolean){
        if(!isOpen){
            form.reset()
        }
        setOpen(open)
    }
    const form = useForm<ChapterSchmeaType>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(ChapterSchema) as any,
        defaultValues: {
            name:'',
            courseId:courseId
        },
    });
    async function onSubmit(values:ChapterSchmeaType){
        SetTransition(async()=>{
            try {
                const {status}=await CreateChapter(values)
                if(status==='error'){
                    toast.error("Failed to create chapter")
                    return;
                }
                if(status=='success'){
                    toast.success("Created chapter succesfully!")
                    form.reset()
                    router.refresh()
                    setOpen(false)
                }
            } catch{
                toast.error("Could not create chapter,try again")
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant='outline' size='sm' className="gap-2">
                    <PlusIcon className="size-4"/>New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>
                        Create new chapter
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name your chapter?
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
                                    <Input placeholder="Chapter Name..." {...field}/>
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