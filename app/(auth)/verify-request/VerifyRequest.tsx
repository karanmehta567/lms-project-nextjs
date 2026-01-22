'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth-client'
import { Loader2Icon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function VerifyRequest(){
    const router=useRouter()
    const [otp,setotp]=useState("")
    const [emailPending,SetEmailPending]=useTransition();
    const params=useSearchParams()
    const email=params.get('email') as string
    const otpCompleted=otp.length===6

    function VerifyOTP(){
        SetEmailPending(async()=>{
            await authClient.signIn.emailOtp({
                email:email,
                otp:otp,
                fetchOptions:{
                    onSuccess:()=>{
                        toast.success('Email verified')
                        router.push('/')
                    },
                    onError:()=>{
                        toast.error('Could not verify')
                    }
                }
            })
        })
    }
    return (
        <Card className='w-full mx-auto'>
            <CardHeader className='text-center'>
                <CardTitle className='text-xl'>Please check your Spam Folder</CardTitle>
                <CardDescription>We have sent an OTP to your E-mail, please open your mail provider and enter the OTP here</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
                <div className='flex flex-col items-center space-y-2'>
                    <InputOTP value={otp}maxLength={6} className='gap-2' onChange={(value)=>setotp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                            <InputOTPSlot index={5}/>
                        </InputOTPGroup>
                    </InputOTP>
                    <p className='text-sm text-muted-foreground'>Enter the 6 digit code sent to your email</p>
                </div>
                <Button className='w-full cursor-pointer' onClick={VerifyOTP} disabled={emailPending || !otpCompleted}>
                    {emailPending?(
                        <>
                        <Loader2Icon className='size-4 animate-spin'/>
                        Verifying....
                        </>
                    ):(
                        <>
                        <span>Verify Account</span>
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}