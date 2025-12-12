'use client'
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { DropDownHandler } from "./DropDown";
import { Loader2Icon } from "lucide-react";

const NavItems=[
    {
        name:'Home',
        href:'/'
    },
    {
        name:'Courses',
        href:'/dashboard/courses'
    },
    {   
        name:'Dashboard',
        href:'/dashboard'
    }
]
export function Navbar(){
    const {data:session,isPending}=authClient.useSession();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
            <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                <Link href='/' className="flex items-center space-x-2 mr-4">
                    <Image src={'/cactus.jpg'} alt="logo" className="size-9" width={50} height={50}/>
                    <span className="font-bold">BroqLMS.</span>
                </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:flex-1 md:justify-between md:items-center">
                <div className="flex items-center space-x-2">
                    {
                        NavItems.map((item,index)=>(
                            <Link key={index} href={item.href} className="text-md font-medium transition-colors hover:text-primary">
                                {
                                    item.name
                                }
                            </Link>
                        ))
                    }
                </div>
                <div className="flex items-center justify-center space-x-4">
                    <ModeToggle/>
                    {
                        isPending?<Loader2Icon className="size-4 animate-spin"/>:session?(
                            <DropDownHandler
                                email={session.user.email}
                                name={session?.user?.name&&session.user.name.length>0?session.user.name:session?.user?.email.split("@")[0]}
                                image={session.user.image || ""}
                            />
                        ):(
                            <>
                            <Link href={'/login'} className={buttonVariants()}>
                                Login
                            </Link>
                            <Link href={'/login'} className={buttonVariants({variant:'outline'})}>
                                Get Started
                            </Link>
                            </>
                        )
                    }
                </div>
            </nav>
            </div>
        </header>
    )
}