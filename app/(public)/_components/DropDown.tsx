import {
  BookIcon,
  ChevronDownIcon,
  Home,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface Iprops{
    name:string,
    email:string,
    image:string
}
export function DropDownHandler({email,image,name}:Iprops) {
    async function handleSignOut() {
        try {
            await authClient.signOut(); 
            toast.success('Sign out succesfully!')             // call the hook-provided signOut
            }
        catch (err) {
            console.error("Sign out failed", err);
        }
    }
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
            <Avatar>
                <AvatarImage alt="Profile image" src={image} />
                <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <ChevronDownIcon
                aria-hidden="true"
                className="opacity-60"
                size={16}
            />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64" align="end">
            <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-foreground text-sm">
                {name}
            </span>
            <span className="truncate font-normal text-muted-foreground text-xs">
                {email}
            </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <DropdownMenuItem asChild>
                <Link href={'/'}>
                    <Home aria-hidden="true" className="opacity-60" size={16} />
                    <span>Home</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link href={'/courses'}>
                <BookIcon aria-hidden="true" className="opacity-60" size={16} />
                    <span>Courses</span>
            </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={'/dashboard'}>
                <LayoutDashboard aria-hidden="true" className="opacity-60" size={16} />
                    <span>Dashboard</span>
                </Link>
            </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Logout</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    );
}
