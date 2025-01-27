import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const token = body.token;

    const connection = createConnection();
    try {
        const toBeVerified = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT username FROM user_information WHERE verificationToken=?', [token], (err, results: any[]) => {
                if (err) {
                    console.log('user grab rejected');
                    console.log(err);
                    reject(err);
                } else {
                    console.log('user grab successful');
                    resolve(results);
                }
            });
        });

        if (toBeVerified.length > 0) {
            //Need to make this a promise more than likely...
            await new Promise<any[]>((resolve, reject) => {
            connection.query('UPDATE user_information SET isVerified=1, verificationToken=NULL WHERE verificationToken=?', [token],
                (err, results: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
            //Send 'success' response
            return new Response(JSON.stringify({response: "Email verified successfully!"}), {
                headers: { "Content-Type": "application/json" },
                status: 200
            });
        } else {
            //Send 'invalid token' response
            return new Response(JSON.stringify({response: "Invalid token."}), {
                headers: { "Content-Type": "application/json" },
                status: 401
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