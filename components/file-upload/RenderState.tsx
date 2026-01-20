import { cn } from "@/lib/utils";
import { CloudUpload, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderState({isDragActive}:{isDragActive:boolean}){
    return(
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted p-4">
                <CloudUpload className={cn(
                    'size-10 text-muted-foreground',
                    isDragActive&&'text-primary'
                )}/>
            </div>
            <p className="font-semibold text-foreground">Drop your files here or<span className="font-bold text-primary cursor-pointer"> Click to upload</span></p>
            <Button className="mt-4" type="button">Select Files</Button>
        </div>
    )
}
export function RenderImageState({previewURL,isDeleting,handleRemove,fileType}:{previewURL:string;isDeleting:boolean;handleRemove:()=>void;fileType:'image'|'video'}){
    return (
        <div className="relative group w-full h-full flex items-center justify-center">
            {
                fileType==='video'?(
                    <video controls src={previewURL} className="rounded-md w-full h-full"/>
                ):(
                    <Image src={previewURL} alt="Display Image" fill className="object-contain p-2"/>
                )
            }
            <Button variant='destructive' className={cn(
                "absolute top-4 right-4"
            )} onClick={handleRemove} disabled={isDeleting}>
                {
                    isDeleting?(
                        <Loader2Icon className="size-4 animate-spin"/>
                    ):(
                        <XIcon className="size-4"/>
                    )
                }
            </Button>
        </div>
    )
}
export function RenderProgressBar({progress,file}:{progress:number,file:File}){
    return (
        <div className="text-center flex justify-center items-center flex-col">
            <p>{progress}</p>
            <p className="mt-2 text-sm font-medium text-foreground">Uploading......</p>
            <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
        </div>
    )
}
export function RenderError(){
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive p-4">
                    <ImageIcon className={cn(
                        'size-10 text-destructive'
                    )}/>
            </div>
            <p className="font-bold">Upload Failed!</p>
            <p className="text-xl mt-1 text-muted-foreground">Something went wrong,try again please!</p>
            <Button className="mt-4" type="button">Retry again</Button>
        </div>
    )
}