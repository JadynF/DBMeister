import { NextResponse } from "next/server";
import { hashPassword, comparePasswords } from '@/lib/bcrypt'
import { createConnection } from '@/lib/db';

export async function POST(req: Request) {

    const connection = createConnection();
    try {
        const { currUsername, currPassword, username, email, password } = await req.json();
        console.log("Inputted params: ", currUsername, currPassword, username, email, password);

        const getUser = await new Promise<any[]>((resolve, reject) => {
            connection.query("SELECT * FROM user_information WHERE username=?", [currUsername], (err, results: any[]) => {
                if (err) {
                    reject(err); // Reject if there's an error
                } else {
                    resolve(results); // Resolve promise with results
                }
            });
        });
        console.log(getUser[0]);
        console.log(getUser[0].password);
        const passwordsMatched = await comparePasswords(currPassword, getUser[0].password);
        if(passwordsMatched){
            console.log("good to go");
            if(password){
                console.log("username empty");
                const hashedPass = await hashPassword(password);
                const updatePassword = await new Promise<any[]>((resolve, reject) => {
                    connection.query('UPDATE user_information SET password=? WHERE username=?', [hashedPass, currUsername], (err, results: any[]) => {
                        if (err) {
                            reject(err); // Reject if there's an error
                        } else {
                            resolve(results); // Resolve promise with results
                        }
                    });
                });
            }
            if(email){
                const updateEmail = await new Promise<any[]>((resolve, reject) => {
                    connection.query('UPDATE user_information SET email=? WHERE username=?', [email, currUsername], (err, results: any[]) => {
                        if (err) {
                            reject(err); // Reject if there's an error
                        } else {
                            resolve(results); // Resolve promise with results
                        }
                    });
                });
            }
            if(username){
                console.log("password empty");
                const updateUsername = await new Promise<any[]>((resolve, reject) => {
                    connection.query('UPDATE user_information SET username=? WHERE username=?', [username, currUsername], (err, results: any[]) => {
                        if (err) {
                            reject(err); // Reject if there's an error
                        } else {
                            resolve(results); // Resolve promise with results
                        }
                    });
                });
            }
            return new Response(JSON.stringify({response: "Account updated successfully!"}), {
                headers: { "Content-Type": "application/json" },
                status: 200
            });
        } else {
            console.log("you retard");
            return new Response(JSON.stringify({response: "Account update failed!"}), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}