"use server"
import { ReqUsser } from "@/app/data/user/get-user"
import prisma from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { APIResponse } from "@/lib/types"
import { request } from "@arcjet/next"
import { redirect } from "next/navigation"
import Stripe from "stripe"
import { aj } from "./_components/arcjet"

export async function EnrollInCourseAction(courseId:string):Promise<APIResponse|never>{
    // fetch the user from better auth session
    const userWithSession=await ReqUsser()
    let checkouturl:string;
    try {
        const req=await request()
        const decision=aj.protect(req,{
            fingerprint:userWithSession.id
        })
        if((await decision).isDenied()){
            return {
                status:'error',
                message:'Blocked!!!'
            }
        }
        
        // initiating the payment , find the course user is ref to
        const course=await prisma.courses.findUnique({
            where:{
                id:courseId
            },
            select:{
                id:true,
                title:true,
                price:true,
                slug:true
            }
        }) 
        if(!course){
            return {
                status:'error',
                message:'Course not found'
            }
        }
        // check if already stripeid exists 
        let stripeCustomerId:string;
        const userwithStripeId=await prisma.user.findUnique({
            where:{
                id:userWithSession.id
            },
            select:{
                stripeCustomerId:true
            }
        })
        if(userwithStripeId?.stripeCustomerId){
            stripeCustomerId=userwithStripeId.stripeCustomerId
        }else{
            const customer=await stripe.customers.create({
                email:userWithSession.email,
                name:userWithSession.name,
                metadata:{
                    userId:userWithSession.id
                }
            })
            stripeCustomerId=customer.id
            await prisma.user.update({
                where:{
                    id:userWithSession.id
                },
                data:{
                    stripeCustomerId:stripeCustomerId
                }
            })
        }
        // atomicity , one fails everyone fails
        const result=await prisma.$transaction(async(tx)=>{
            const exisitngUser=await tx.enrollment.findUnique({
                where:{
                    userId_courseId:{
                        userId:userWithSession.id,
                        courseId:course.id
                    }
                },
                select:{
                    id:true,
                    status:true
                }
            }) 
            if(exisitngUser?.status=='Active'){
                return {
                    status:'success',
                    message:'Already enrolled in course'
                }
            }
            let enrollment;
            if(exisitngUser){
                enrollment=await tx.enrollment.update({
                    where:{
                        id:exisitngUser.id
                    },
                    data:{
                        amount:course.price,
                        status:'Pending',
                        updatedAt:new Date()
                    }
                })
            }else{
                enrollment=await tx.enrollment.create({
                    data:{
                        userId:userWithSession.id,
                        courseId:course.id,
                        amount:course.price,
                        status:'Pending'
                    }
                })
            }
            // checkout
            const checkoutsession=await stripe.checkout.sessions.create({
                mode:'payment',
                customer:stripeCustomerId,
                line_items:[
                    {
                        price:"price_1SrMCEA2Uvrh7b9926Pec1Mp",
                        quantity:1
                    }
                ],
                success_url:`${process.env.BETTER_AUTH_URL}/payment/success`,
                cancel_url:`${process.env.BETTER_AUTH_URL}/payment/failure`,
                metadata:{
                    userId:userWithSession.id,
                    courseId:course.id,
                    enrollment:enrollment.id
                }
            })
            return {
                enrollment:enrollment,
                checkoutUrl:checkoutsession.url
            }
        })
        checkouturl=result.checkoutUrl as string
    } catch (error) {
        if(error instanceof Stripe.errors.StripeError){
            return {
                status:'error',
                message:'Payment system error'
            }
        }
        return {
            status:'error',
            message:'Failed to enroll'
        }
    }
    redirect(checkouturl)
}