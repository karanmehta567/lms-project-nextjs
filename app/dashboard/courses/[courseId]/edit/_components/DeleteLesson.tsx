import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DeleteLessonPrisma } from "@/lib/edit";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DeleteLesson({chapterId,courseId,lessonId}:{chapterId:string,courseId:string,lessonId:string}){
    const [open,setOpen]=useState(false)
    const [StartTransition,SetTransition]=useTransition()
    function handleOpenChange(open:boolean){
        setOpen(open)
    }
    function handleDelete(){
        SetTransition(async()=>{
            try {
                const {status:data}=await DeleteLessonPrisma(chapterId,courseId,lessonId)
                if(data=='error'){
                    toast.error("Failed to delete lesson")
                    return;
                }
                if(data=='success'){
                    toast.success("Succesfully deleted lesson")
                    setOpen(false)
                }
            } catch (error) {
                
            }
        })
    }
    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button variant='ghost' size='icon'>
                    <Trash2Icon className="size-4"/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.This will delete the lesson permanently.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button onClick={handleDelete} disabled={StartTransition}>
                        {
                            StartTransition?(
                                <p>Deleting...</p>
                            ):(
                                <div>
                                    Delete
                                </div>
                            )
                        }
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}