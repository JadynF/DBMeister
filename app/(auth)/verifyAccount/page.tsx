'use client';
import { useState } from 'react';

//Shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function VerifyAccount() {
    const [dialog, setDialog] = useState("");
    const [errorMessage, setError] = useState("");

    const submitVerification = async () => {
        setError("");
        setDialog("");

        const url = new URL(window.location.href as string);
        const token = url.searchParams.get('token');
        const verificationToken = {
            token: token
        };

        setDialog("Attempting to verify your account...");
        const res = await fetch('api/verifyAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(verificationToken)
        });
        const data = await res.json();

        if(res.ok) {
            setDialog(data.response);
            await new Promise((resolve) => setTimeout(resolve, 1000)); //delay for user to read dialog
            setDialog("You can now exit this page.");
        } else {
            setDialog("");
            setError(data.response);
        }
    }

    return (
        <div className="flex w-[100vw] h-[100vh] justify-center items-center align-center bg-indigo-600">
            <Card className="w-[350px] bg-blue-100">
                <CardHeader>
                    <CardTitle className=' flex justify-center'>Verify your Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex justify-center space-y-1.5">
                            <Label htmlFor="verifyInfo">Press this button to verify your account.</Label>
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={submitVerification}>Verify</Button>
                </CardFooter>
                <Label className={dialog==="" ? "hidden":"flex justify-center font-medium text-lg tracking-wide"}>{dialog}</Label>
                <Alert variant="destructive" className={errorMessage==="" ? "hidden":"bg-blue-100 font-bold break-words max-w-md border-none"}>
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="font-bold">Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            </Card>
            {/* Need to create a way for the user to fix their email address if all other checks fail and the email is invalid.
                Maybe put a button here to link to a new page? Or replace the registration form with a 'New Email' form? */}
        </div>
    )
}

// Inline styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh', /* Full viewport height */
    width: '100vw', /* Full viewport width */
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    background: '#bfdbfe'
};
