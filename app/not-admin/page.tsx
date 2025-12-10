import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldXIcon } from "lucide-react";
import Link from "next/link";

export default function NotAdmin(){
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
                        <ShieldXIcon className="size-16 text-destructive"/>
                    </div>
                    <CardTitle>
                        Access Denied!
                    </CardTitle>
                    <CardDescription>
                        This Website is protected through Arcjet <br />(Huge Shoutout to them)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href={'/'} className={buttonVariants({
                        className:'w-full'
                    })}>
                        <ArrowLeft className="mr-1 size-5"/>
                        Back to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}