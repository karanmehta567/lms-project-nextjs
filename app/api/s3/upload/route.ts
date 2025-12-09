import { PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import z from "zod"
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Bucket } from "@/lib/s3-client";

export const FileUploadSchema=z.object({
    fileName:z.string().min(1,{message:'File Name required'}),
    contentType:z.string().min(1,{message:'Content type is required'}),
    size:z.number().min(1,{message:'Size required'}),
    isImage:z.boolean()
})
export async function POST(request:Request){
    try {
        const body=await request.json()
        const bodyParse=FileUploadSchema.safeParse(body)
        if(!bodyParse.success){
            return NextResponse.json({error:'Invalid request body'},{status:400})
        }
        const {fileName,contentType,size}=bodyParse.data
        const uniqueKey=`${uuidv4()}-${fileName}`
        const command=new PutObjectCommand({
            Bucket:process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            ContentType:contentType,
            ContentLength:size,
            Key:uniqueKey
        })
        const PreSignedURL=await getSignedUrl(S3Bucket,command,{
            expiresIn:360 //6 mints
        })
        const response={
            PreSignedURL,
            key:uniqueKey
        }
        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({
            error:'Failed to create pre-signed url'
        },{status:500})
    }
}