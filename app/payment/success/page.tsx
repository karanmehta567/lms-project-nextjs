import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess(){
    return (
        <div className="w-full min-h-screen flex flex-1 items-center justify-center">
            <Card className="w-[350px]">
                <CardContent>
                    <div className="w-full flex justify-center">
                        <CheckIcon className="size-12 p-2 bg-green-500/50 text-green-500 rounded-full"/>
                    </div>
                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">Payment Succesful!</h2>
                        <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
                            Payment was succesful,you now have access to course
                        </p>
                        <Link href={'/dashboard'} className={buttonVariants({className:'w-full mt-5 cursor-pointer'})}>
                            <ArrowLeft className="size-4"/>
                            Go to Dashboard
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}