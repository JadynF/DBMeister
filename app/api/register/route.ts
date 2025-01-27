import { createConnection } from '@/lib/db';
import { hashPassword } from "@/lib/bcrypt";
import { validateMailbox, makeCarrier, sendVerificationEmail } from '@/lib/nodemailer';
const crypto = require('crypto');


export async function POST(req: Request) {
    const body = await req.json();
    const {firstName, lastName, username, password, email} = body;
    const hashedPass = await hashPassword(password);
    const vToken = crypto.randomBytes(20).toString('hex');

    const { emailValidity, hasError, error } = await validateMailbox(email);
    if(!emailValidity && hasError) {
        return new Response(JSON.stringify({response: error}), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    } else if (!emailValidity && !hasError) {
        return new Response(JSON.stringify({response: "Please provide a valid email address."}), {
            headers: { "Content-Type": "application/json" },
            status: 401
        });
    } else {
        const connection = createConnection();
        try {
            const registerUser = await new Promise<any[]>((resolve, reject) => {
                connection.query('INSERT INTO user_information (firstName, lastName, username, password, email, verificationToken) VALUES (?, ?, ?, ?, ?, ?)', 
                                [firstName, lastName, username, hashedPass, email, vToken], (err, results: any[]) => {
                    if (err) {
                        reject(err); // Reject if there's an error
                    } else {
                        resolve(results); // Resolve promise with results
                    }
                });
            });
            //Registered user. Now create a verification email.
            const carrier = await makeCarrier();
            const sendSuccess = await sendVerificationEmail(carrier, email, vToken);
            //These responses are placeholder. This will all need to change/move w/ inclusion of MailboxValidator API
            if(!sendSuccess) {
                return new Response(JSON.stringify({response: "There was an error sending your verification email."}), {
                    headers: { "Content-Type": "application/json" },
                    status: 500
                });
            } else {
                return new Response(JSON.stringify({response: "A verification email has been sent to the address you provided."}), {
                    headers: { "Content-Type": "application/json" },
                    status: 200
                });
            }
        } catch (error) {
            return new Response(JSON.stringify({response: "An unexpected error has occurred. Please try again later."}), {
                headers: { "Content-Type": "application/json" },
                status: 500
            });
        } finally {
            connection.end();
        }
    }
}