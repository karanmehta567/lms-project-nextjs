import 'server-only'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function ReqAction(){
    const session=await auth.api.getSession({
        headers:await headers(),
    })
    if(!session){
        return null;
    }
    return session
}