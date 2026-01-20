import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentFailure(){
    return (
        <div className="w-full min-h-screen flex flex-1 items-center justify-center">
            <Card className="w-[350px]">
                <CardContent>
                    <div className="w-full flex justify-center">
                        <XIcon className="size-12 p-2 bg-red-500/50 text-red-500 rounded-full"/>
                    </div>
                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">Payment Cancelled</h2>
                        <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">No worries,you wont't be charged,please try again later!</p>
                        <Link href={'/'} className={buttonVariants({className:'w-full mt-5 cursor-pointer'})}>
                            <ArrowLeft className="size-4"/>
                            Go back to Homepage
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}