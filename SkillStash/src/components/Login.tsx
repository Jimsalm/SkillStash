import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Login() {
  return (
    <Card className='w-full max-w-sm'>
        <CardHeader>
            <CardTitle className='text-2xl'>Login</CardTitle>
            <CardDescription>
                Enter your email below to login your account.
            </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='name@example.com' required/>
            </div>
            <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' type='password' placeholder='********' required/>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
            <Button className="w-full">Sign in</Button>
            <Button className="w-full" variant="outline">Login with Google</Button>
            <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline">
                Sign up
            </a>
            </div>
        </CardFooter>
    </Card>
  )
}

export default Login