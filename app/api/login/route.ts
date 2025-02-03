import { createConnection } from '@/lib/db';
import { comparePasswords } from '@/lib/bcrypt'
//import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_SECRET;

export async function POST(req: Request) { //seems we want type 'Request' if we need to take values from the body
    
    const body = await req.json(); //Need to parse the request to take body elements
    const inUsername = body.username;
    const inPassword = body.password;
    let realPassword = ''; //Default to avoid error

    const connection = createConnection();
    try {
        // Promisified query for async/await
        const userRow = await new Promise<any[]>((resolve, reject) => {
            connection.query("SELECT * FROM user_information WHERE username=?", [inUsername], (err, results: any[]) => {
                if (err) {
                    reject(err); // Reject if there's an error
                } else {
                    resolve(results); // Resolve promise with results
                }
            });
        });

        realPassword = userRow[0].password;
        let userVerified = userRow[0].isVerified;
        let passwordsMatched = await comparePasswords(inPassword, realPassword);

        if(!passwordsMatched) {
            return new Response(JSON.stringify({response: "The password for this account is incorrect."}), {
                headers: { "Content-Type": "application/json" },
                status: 401
            });
        } else if(userVerified === 0) {
            return new Response(JSON.stringify({response: "Your email has not been verified. Please check your email."}), {
                headers: { "Content-Type": "application/json" },
                status: 401
            });
        } else {
            const jwtToken = jwt.sign({ userData: userRow[0] }, jwtKey, { expiresIn: '3h' }); // create jwt and send to client
            console.log("Sending token: " + jwtToken);
            return new Response(JSON.stringify({response: "accepted", token: jwtToken}), {
                headers: { "Content-Type": "application/json" },
                status: 200
            });
        }
    }
    catch (error) {
        console.error("Unexpected error: ", error);
        return new Response(JSON.stringify({ error: "Unexpected error occurred" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    } finally {
        connection.end(); //ALWAYS REMEMBER TO END CONNECTION!
    }
}