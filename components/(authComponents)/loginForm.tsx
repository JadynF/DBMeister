"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LoginForm = () => {
    //Variables for user input
    const [uNameInput, setUName] = useState("");
    const [passInput, setPassword] = useState("");
    const [errorMessage, setError] = useState("");
    const [dialog, setDialog] = useState("");

    //handle changes to username and password input
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => setUName(event.target.value);
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

    const router = useRouter();

    const submitLogin = async () => {
        setError("");
        setDialog("Loading...");
        const loginQuery = {
            username: uNameInput,
            password: passInput
        };

        const res = await fetch('api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(loginQuery)
        });
        const data = await res.json();
        
        if(data.response === "accepted") {
            setDialog("Sending you to the dash...");
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay for cool factor
            router.push("/dashboard");
        } else {
            setDialog("");
            setError(data.response);
        }
    }

    return (
        <div>
            <Card className="w-[350px] bg-blue-100">
                <CardHeader>
                    <CardTitle>Log into DBMeister</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input id="usernameIn" placeholder="Enter your Username" className="bg-blue-50" onChange={handleUsernameChange}/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="passwordIn" placeholder="Enter your Password" className="bg-blue-50" onChange={handlePasswordChange}/>
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={submitLogin}>Log In</Button>
                </CardFooter>
                <Label className={dialog==="" ? "hidden":"flex justify-center font-medium text-lg tracking-wide"}>{dialog}</Label>
                <Alert variant="destructive" className={errorMessage==="" ? "hidden":"bg-blue-100 font-bold break-words max-w-md border-none"}>
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="font-bold">Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            </Card>
        </div>
    )
}

export default LoginForm;
