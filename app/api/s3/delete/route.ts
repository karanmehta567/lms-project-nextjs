import { ReqAdmin } from "@/app/data/user/require";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { S3Bucket } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const arcjetRule=arcjet.withRule(
    detectBot({
        mode:'LIVE',
        allow:[]
    })
).withRule(
    fixedWindow({
        mode:'LIVE',
        window:'1m',
        max:5
    })
)
export async function DELETE(request:Request){
    const session=await ReqAdmin() 
    try {
        const decision=await arcjetRule.protect(request,{
                fingerprint:session?.user?.id as string
            })
        if(decision.isDenied()){
                return NextResponse.json({error:'Get Away Oversmart Kid!'},{status:420})
        }
        const body=await request.json();
        const key=body.key
        if(!key){
            return NextResponse.json({error:'Missing key!'},{status:400})
        }
        const command=new DeleteObjectCommand({
            Bucket:process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key:key
        })
        await S3Bucket.send(command)
        return NextResponse.json({message:'File deleted'},{status:200})
    } catch (error) {
        return NextResponse.json({message:'Could not delete file,try again!'},{status:500})
    }
}