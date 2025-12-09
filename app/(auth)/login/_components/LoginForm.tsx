'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { GithubIcon, Loader2Icon, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner';

function LoginForm() {
    const router=useRouter()
    const [githubpending,startgithub]=useTransition();
    const [CustomEmail,SetCustomEmail]=useTransition();
    const [Email,SetEmail]=useState("")
        async function StartLoginGitHub(){
            startgithub(async()=>{
                await authClient.signIn.social({
                    provider:'github',
                    callbackURL:'/',
                    fetchOptions:{
                        onSuccess:()=> {
                            toast.success("Signing with Github.....")
                        },
                        onError:(error)=>{
                            toast.error('Some error occured!')
                        }
                    }
                })
            })
        }
        function SignInWithEmail(){
            SetCustomEmail(async()=>{
                await authClient.emailOtp.sendVerificationOtp({
                    email:Email,
                    type:'sign-in',
                    fetchOptions:{
                        onSuccess:()=>{
                            toast.success('OTP Sent!')
                            router.push(`/verify-request?email=${Email}`)
                        },
                        onError:()=>{
                            toast.error('Error sending OTP')
                        }
                    }
                })
            })
        }
return (
    <Card className='border-amber-50'>
            <CardHeader className='flex justify-center items-center flex-col'>
                <CardTitle className='text-2xl'>Welcome back!</CardTitle>
                <CardDescription>Login with your GitHub or E-mail</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <Button className='w-full' variant='outline' onClick={StartLoginGitHub} disabled={githubpending}>
                {githubpending?(
                    <>
                        <Loader2Icon className='size-4 animate-spin'/>
                        <span>Loading......</span>
                    </>
                ):(
                    <>
                    <GithubIcon className='size-4'/>
                    Sign in with GitHub
                    </>
                )}
                </Button>

                <div className='mt-3 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                    <span className='relative z-10 bg-card px-2 text-muted-foreground'>Or Continue with</span>
                </div>
                <div className='grid gap-3'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>E-mail</Label>
                        <Input type='email' placeholder='abc@gmail.com' value={Email} onChange={(e)=>SetEmail(e.target.value)} required></Input>
                    </div>
                    <Button onClick={SignInWithEmail} disabled={CustomEmail} className='cursor-pointer'>
                        {
                            CustomEmail?(
                                <>
                                    <Loader2Icon className='size-4 animate-spin'/>
                                    <span>Loading.....</span>
                                </>
                            ):(
                                <>
                                <Send className='size-4'/>
                                <span>Continue with E-mail</span>
                                </>
                            )
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
  )
}

export default LoginForm