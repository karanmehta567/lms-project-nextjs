import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DeleteChapterPrisma} from "@/lib/edit";
import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DeleteChapter({chapterId,courseId}:{chapterId:string,courseId:string}){
    const [open,setOpen]=useState(false)
    const [StartTransition,SetTransition]=useTransition()
    function handleOpenChange(open:boolean){
        setOpen(open)
    }
    function handleDelete(){
        SetTransition(async()=>{
            try {
                const {status:data}=await DeleteChapterPrisma(chapterId,courseId)
                if(data=='error'){
                    toast.error("Failed to delete lesson")
                    return;
                }
                if(data=='success'){
                    toast.success("Succesfully deleted chapter")
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
                    <AlertDialogDescription>This action cannot be undone.This will delete the chapter permanently.</AlertDialogDescription>
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