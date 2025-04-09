"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail, User, Lock } from "lucide-react";

const RegisterForm = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    passwordConfirm: "",
    email: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id.replace("In", "")]: value
    });
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  // Check if passwords match
  const doPasswordsMatch = () => {
    return formData.password === formData.passwordConfirm;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Form validation
    if (!formData.firstName || !formData.lastName) {
      setErrorMessage("Please enter your full name");
      return;
    }
    
    if (!formData.username) {
      setErrorMessage("Please choose a username");
      return;
    }
    
    if (!formData.password) {
      setErrorMessage("Please create a password");
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    
    if (!doPasswordsMatch()) {
      setErrorMessage("Your passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setStatusMessage("Creating your account...");
    
    try {
      const registrationQuery = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
        email: formData.email
      };
      
      const res = await fetch('api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(registrationQuery)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatusMessage(data.response || "Account created successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setStatusMessage("");
        setErrorMessage(data.response || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <Card className="border-none shadow-lg bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstNameIn" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstNameIn"
                  placeholder="John"
                  className="bg-gray-50 border-gray-200"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastNameIn" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastNameIn"
                  placeholder="Doe"
                  className="bg-gray-50 border-gray-200"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usernameIn" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="usernameIn"
                  placeholder="Choose a username"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailIn" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="emailIn"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordIn" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="passwordIn"
                  type="password"
                  placeholder="Create a secure password"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirmIn" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="passwordConfirmIn"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          
          {statusMessage && !errorMessage && (
            <div className="mt-4 text-center text-sm font-medium text-indigo-600">
              {statusMessage}
            </div>
          )}
          
          {errorMessage && (
            <Alert variant="destructive" className="mt-4 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;