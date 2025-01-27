"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const RegisterForm = () => {
    const router = useRouter();

    const [firstName, setFName] = useState("");
    const [lastName, setLName] = useState("");
    const [username, setUName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPassConfirm] = useState("");
    const [email, setEmail] = useState("");
    //variable to communicate with user
    const [dialog, setDialog] = useState("");
    const [errorMessage, setError] = useState("");

    //handles changes to user input variables
    const handleFNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {setFName(event.target.value);}
    const handleLNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {setLName(event.target.value);}
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {setUName(event.target.value);}
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value);}
    const handlePasswordConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {setPassConfirm(event.target.value);}
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value);}

    //Validates format of inputted email
    const checkEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }
    const comparePasswords = (password: string, confirmation: string) => {
        if(password === confirmation) {
            return true;
        } else {
            return false;
        }
    }

    const submitRegistration = async () => {
        setError("");
        if(!checkEmail(email)){
            setError("Your email address is not a valid format.");
            return;
        } else if (!comparePasswords(password, passwordConfirm)){
            setError("Your passwords do not match.");
        } else {
            setDialog("Attempting to create your account...");
            const registrationQuery = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: password,
                email: email
            };

            const res = await fetch('api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(registrationQuery)
            });
            const data = await res.json();
            if(res.ok) {
                setDialog(data.response);
            } else {
                setDialog("");
                setError(data.response);
            }
        }
    }

    //Add function to handle failed email here (either page link or react input handling) in the far future

    return (
        <div>
            <Card className="w-[350px] bg-blue-100">
                <CardHeader>
                    <CardTitle>Register an Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstNameIn" placeholder="Enter your First Name" className="bg-blue-50" onChange={handleFNameChange}/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastNameIn" placeholder="Enter your Last Name" className="bg-blue-50" onChange={handleLNameChange}/>
                        </div>
                        <p></p>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Choose a Username</Label>
                            <Input id="usernameIn" placeholder="Enter your Username" className="bg-blue-50" onChange={handleUsernameChange}/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Choose a Password</Label>
                            <Input id="passwordIn" placeholder="Enter your Password" className="bg-blue-50" onChange={handlePasswordConfirm}/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="passwordConfirm">Confirm your Password</Label>
                            <Input id="passwordConfirm" placeholder="Re-enter your Password" className="bg-blue-50" onChange={handlePasswordChange}/>
                        </div>
                        <p></p>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="emailIn" placeholder="Enter your Email" className="bg-blue-50" onChange={handleEmailChange}/>
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={submitRegistration}>Register your Account</Button>
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

export default RegisterForm;