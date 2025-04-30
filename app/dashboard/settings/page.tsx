"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Settings, LogOut, Trash2 } from "lucide-react";

const SettingsPage = () => {

    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState("medium");
    const [currUser, setCurrUser] = useState("");
    const [currPass, setCurrPass] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    // Load settings from local storage
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const storedFontSize = localStorage.getItem("fontSize");
        const storedUsername = localStorage.getItem("username");
        if (storedTheme === "dark") setDarkMode(true);
        if (storedFontSize) setFontSize(storedFontSize);
        if (storedUsername) setUsername(storedUsername);
    }, []);

    // Save settings to local storage
    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        localStorage.setItem("fontSize", fontSize);
        document.documentElement.className = darkMode ? "dark" : "light";
    }, [darkMode, fontSize]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleDeleteAccount = async () => {
        try {
            const res = await fetch("/api/delete-account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                localStorage.clear();
                alert("Account deleted successfully.");
                router.push("/signup");
            } else {
                alert("Failed to delete account. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    const handleCurrUserChange = (event: React.ChangeEvent<HTMLInputElement>) => setCurrUser(event.target.value);
    const handleCurrPassChange = (event: React.ChangeEvent<HTMLInputElement>) => setCurrPass(event.target.value);
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value);

    const handleUpdateAccount = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const reqBody = {
            currUsername: currUser,
            currPassword: currPass,
            username: username,
            email: email,
            password: password
        };
        try {
            const res = await fetch("/api/update-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody),
            });
            if (res.ok) {
                alert("Account updated successfully.");
            } else {
                alert("Failed to update account. Please try again.");
            }
        } catch (error) {
            console.error("Error updating account:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <>
            {/* Modern Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                    <Settings className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
                    Account Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                    Manage your account preferences and personal information
                </p>
            </div>

            {/* Content Container */}
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden p-6">
                <div className="flex flex-col max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                            Appearance & Account
                        </h2>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Appearance Section */}
                        <Card className="border border-slate-200 dark:border-slate-700">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/60">
                                <CardTitle className="text-md font-medium">Display Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-medium text-slate-800 dark:text-slate-200">Dark Mode</Label>
                                        <Switch 
                                            checked={darkMode} 
                                            onCheckedChange={setDarkMode} 
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="font-size" className="font-medium text-slate-800 dark:text-slate-200">Font Size</Label>
                                        <Select value={fontSize} onValueChange={setFontSize}>
                                            <SelectTrigger id="font-size" className="border-slate-200 dark:border-slate-700">
                                                <SelectValue placeholder="Select Font Size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="small">Small</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="large">Large</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Section */}
                        <Card className="border border-slate-200 dark:border-slate-700">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/60">
                                <CardTitle className="text-md font-medium">Change User Information</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="currUsername" className="font-medium text-slate-800 dark:text-slate-200">Current Username</Label>
                                        <Input 
                                            id="currUsername" 
                                            value={currUser} 
                                            onChange={handleCurrUserChange} 
                                            placeholder="Enter your current username"
                                            className="border-slate-200 dark:border-slate-700" 
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="currPassword" className="font-medium text-slate-800 dark:text-slate-200">Current Password</Label>
                                        <Input 
                                            id="currPassword" 
                                            value={currPass} 
                                            onChange={handleCurrPassChange} 
                                            placeholder="Enter your current password"
                                            className="border-slate-200 dark:border-slate-700" 
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-2"></div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="email" className="font-medium text-slate-800 dark:text-slate-200"> New Email Address</Label>
                                        <Input 
                                            id="email" 
                                            value={email} 
                                            onChange={handleEmailChange} 
                                            placeholder="Enter new email address"
                                            className="border-slate-200 dark:border-slate-700" 
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="username" className="font-medium text-slate-800 dark:text-slate-200">New Username</Label>
                                        <Input 
                                            id="username" 
                                            value={username} 
                                            onChange={handleUsernameChange} 
                                            placeholder="Enter new username"
                                            className="border-slate-200 dark:border-slate-700" 
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="password" className="font-medium text-slate-800 dark:text-slate-200">New Password</Label>
                                        <Input 
                                            id="password" 
                                            type="password" 
                                            value={password} 
                                            onChange={handlePasswordChange} 
                                            placeholder="Enter new password"
                                            className="border-slate-200 dark:border-slate-700" 
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="confirm-password" className="font-medium text-slate-800 dark:text-slate-200">Confirm Password</Label>
                                        <Input 
                                            id="confirm-password" 
                                            type="password" 
                                            value={confirmPassword} 
                                            onChange={handleConfirmPasswordChange} 
                                            placeholder="Confirm new password"
                                            className="border-slate-200 dark:border-slate-700" 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4">
                                <Button 
                                    onClick={handleUpdateAccount}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Update Account
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Actions Section */}
                        <Card className="border border-slate-200 dark:border-slate-700">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/60">
                                <CardTitle className="text-md font-medium">Account Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Sign Out</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">End your current session</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={handleLogout}
                                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Log Out
                                        </Button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                                        <div>
                                            <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Permanently remove your account and data</p>
                                        </div>
                                        <Button 
                                            variant="destructive" 
                                            onClick={handleDeleteAccount}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;