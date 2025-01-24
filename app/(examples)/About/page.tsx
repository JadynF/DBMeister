"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function About() {
    const router = useRouter();
    return (
        <div>
            <h1>About Us</h1>
            <Button variant="link" onClick={() => router.push("/")}>
                Go To Home
            </Button>
        </div>
    )
}