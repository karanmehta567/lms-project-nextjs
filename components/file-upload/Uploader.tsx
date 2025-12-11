'use client'
import { useCallback, useState } from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid';
import { RenderError, RenderImageState, RenderProgressBar, RenderState } from './RenderState'
import { toast } from 'sonner'
import useImageHook from '@/hooks/use-construct'

interface UploadeState{
    id:string|null,
    file:File|null,
    uploading:boolean,
    indicator:number,
    key?:string,
    isDeleting:boolean,
    error:boolean,
    objectUrl?:string,
    fileType:"image"|"video"
}
interface IAppProps{
    value?:string,
    onChange?:(value:string)=>void 
}
export function Uploader({onChange,value}:IAppProps){
    const fileUrl=useImageHook(value||'')
    const [uploadState,SetUplaodState]=useState<UploadeState>({
        error:false,
        file:null,
        id:null,
        uploading:false,
        indicator:0,
        isDeleting:false,
        fileType:'image',
        key:value,
        objectUrl:fileUrl
    })
    async function uploadFile(file:File){
        SetUplaodState((prev)=>({
            ...prev,
            uploading:true,
            indicator:0
        }))
        try {
            const preSignedResponse=await fetch('/api/s3/upload',{
                method:'POST',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    fileName:file.name,
                    contentType:file.type,
                    size:file.size,
                    isImage:true
                })
            })
            if(!preSignedResponse.ok){
                toast.error("Failed to get Pre-Signed URL")
                SetUplaodState((prev)=>({
                    ...prev,
                    uploading:false,
                    indicator:0,
                    error:true
                }))
            return;
            }
            const{PreSignedURL,key}=await preSignedResponse.json()
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / event.total) * 100
                        SetUplaodState(prev => ({ ...prev, indicator: Math.round(percent) }))
                    }
                }

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        SetUplaodState(prev => ({ ...prev, indicator: 100, uploading:false, key }))
                        onChange?.(key)
                        toast.success("Upload Successful")
                        resolve()
                    } else reject(new Error("Upload failed"))
                }

                xhr.onerror = () => reject(new Error("Network error during upload"))

                xhr.open("PUT", PreSignedURL) // S3 upload usually is PUT not POST
                xhr.setRequestHeader("Content-Type", file.type)
                xhr.send(file)
            })
        } catch (error) {
            toast.error("Something went wrong")
            SetUplaodState((prev)=>({
                ...prev,
                progress:0,
                error:true,
                uploading:false
            }))
        }
    }
    async function DeleteFile(){
        if(uploadState.isDeleting||!uploadState.objectUrl){
            return;
        }
        try {
            SetUplaodState((prev)=>({
                ...prev,
                isDeleting:true,
            }))
            const response=await fetch('/api/s3/delete',{
                method:'DELETE',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    key:uploadState.key
                })
            })
            if(!response.ok){
                toast.error("Failed to delete file")
                SetUplaodState((prev)=>({
                    ...prev,
                    isDeleting:true,
                    error:true
                }))
                return;
            }
            onChange?.("")
            SetUplaodState((prev)=>({
                file:null,
                uploading:false,
                indicator:0,
                objectUrl:undefined,
                error:false,
                fileType:'image',
                id:null,
                isDeleting:false
            }))
            toast.success("File deleted succesfully!")
        } catch (error) {
            toast.error("File not deleted !")
            SetUplaodState((prev)=>({
                ...prev,
                isDeleting:false,
                error:true
            }))
        }
    }
    const onDrop = useCallback((acceptedFiles:File[]) => {
        if(acceptedFiles.length>0){
            const file=acceptedFiles[0]
            SetUplaodState({
                file:file,
                uploading:false,
                indicator:0,
                objectUrl:URL.createObjectURL(file),
                error:false,
                id:uuidv4(),
                isDeleting:false,
                fileType:'image'
            })
            uploadFile(file)
        }
    }, [])
    function DropRejection(fileRejection:FileRejection[]){
        if(fileRejection.length){
            const toomanyfiles=fileRejection.find((rejection)=>rejection.errors[0].code==='too-many-files')
            if(toomanyfiles){
                toast.error('Too many files, current limit is only 1')
            }
            const fileTooLarge=fileRejection.find((rejection)=>rejection.errors[0].code==='file-too-large')
            if(fileTooLarge){
                toast.error('File size is too large,must be under 15 MB')
            }
        }
    }
    function RenderContent(){
        if(uploadState.uploading){
            return (
                <RenderProgressBar progress={uploadState.indicator} file={uploadState.file as File}/>
            )
        }
        if(uploadState.error){
            return (
                <RenderError/>
            )
        }
        if(uploadState.objectUrl){
            return (
                <RenderImageState handleRemove={DeleteFile} isDeleting={uploadState.isDeleting} previewURL={uploadState.objectUrl}/>
            )
        }
        return <RenderState isDragActive={isDragActive}/>
    }
    const {getRootProps, getInputProps,isDragActive} = useDropzone(
        {onDrop,accept:{"image/*":[]},maxFiles:1,multiple:false,maxSize:10*1024*1024,onDropRejected:DropRejection,disabled:uploadState.uploading||!!uploadState.objectUrl}
    ) 
    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-60",
            isDragActive?'border-primary bg-primary/10 border-solid':'border-border hover:border-primary'
        )}>
        <CardContent className='flex items-center justify-center h-full w-full'>
            <input {...getInputProps()} />
                {RenderContent()}
        </CardContent>
        </Card>
)
}