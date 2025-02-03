import { NextResponse } from "next/server";
//import bcrypt from "bcryptjs"; // Hash Passwords Securley
import pool from "@/lib/db"; 

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Input validation
        if (!username || !password) {
            return NextResponse.json({ message: "Username and password are required." }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user in the database (replace 'users' with actual table name)
        const query = "UPDATE users SET username = ?, password = ? WHERE ide = ?";
        const values = [username, hashedPassword, 1];

        const [result] = await pool.execute(query, values);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ message: "User not found or no changes made."}, { status: 404 });
        }

        return NextResponse.json({ message: "Account updated successfully." }, { status: 200 });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}