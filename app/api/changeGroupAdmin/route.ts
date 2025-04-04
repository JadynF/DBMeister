import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const userId = body.userId;
    const groupId = body.groupId;

    const connection = createConnection();
    try {
        console.log(userId);
        console.log(groupId);
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('UPDATE `groups` SET admin_id = ? WHERE id = ?;', [userId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return new Response(JSON.stringify({ response: "Changed group admin" }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (err) {
        console.error("Error when changing admin", err);
        return new Response(JSON.stringify({ response: "Error" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    } finally {
        connection.end();
    }
}
