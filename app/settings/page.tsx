"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState("medium");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Add state for confirm password
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
            alert("An error occured. Please try again later.");
        }
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value);

    const handleUpdateAccount = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const res = await fetch("/api/update-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Dark Mode</Label>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="font-size">Font Size</Label>
                            <Select value={fontSize} onValueChange={setFontSize}>
                                <SelectTrigger id="font-size">
                                    <SelectValue placeholder="Select Font Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="username">Change Username</Label>
                            <Input id="username" value={username} onChange={handleUsernameChange} placeholder="Enter new username" />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="password">Change Password</Label>
                            <Input id="password" type="password" value={password} onChange={handlePasswordChange} placeholder="Enter new password" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm new password" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="secondary" onClick={handleUpdateAccount}>
                        Update Account
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                    <Button variant="secondary" onClick={handleLogout}>
                        Log Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SettingsPage;