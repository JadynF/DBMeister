"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Lock, User } from "lucide-react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  
  const router = useRouter();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id === "username" ? "username" : "password"]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default submission
    
    if (!formData.username || !formData.password) {
      setErrorMessage("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    setStatusMessage("Authenticating...");
    
    try {
      const res = await fetch('api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      
      const data = await res.json();
      
      if(data.response === "accepted") {
        document.cookie = `token=${data.token}`;
        setStatusMessage("Success! Redirecting to dashboard...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/dashboard");
      } else {
        setStatusMessage("");
        setErrorMessage(data.response || "Login failed. Please try again.");
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
          <CardTitle className="text-2xl font-bold text-center"></CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign in"
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
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;