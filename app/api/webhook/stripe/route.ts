import prisma from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

export async function POST(req:Request){
    const body=await req.text()
    const headerList=await headers()
    const signature=headerList.get("Stripe-Signature") as string
    let event:Stripe.Event

    try {
        event=stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        return new Response("Webhook error",{status:400})
    }
    const session=event.data.object as Stripe.Checkout.Session
    if(event.type==='checkout.session.completed'){
        const courseId=session.metadata?.courseId
        const customerId=session.customer as string

        if(!courseId){
            throw new Error("No course with id found")
        }
        const user=await prisma.user.findUnique({
            where:{
                stripeCustomerId:customerId
            }
        })
        if(!user){
            throw new Error("No user found")
        }
        await prisma.enrollment.update({
            where:{
                userId_courseId:{
                    userId:user.id,
                    courseId:courseId
                }
            },
            data:{
                amount:session.amount_total as number,
                status:'Active'
            }
        })
    }
    return new Response(null,{status:200})
}