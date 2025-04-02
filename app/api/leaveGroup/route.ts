import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const userId = body.userId;
    const groupId = body.groupId;

    const connection = createConnection();
    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM user_group WHERE user_id = ? AND group_id = ?', [userId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return new Response(JSON.stringify({ response: "Left group" }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (err) {
        console.error("Group Leave error", err);
        return new Response(JSON.stringify({ response: "Error" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    } finally {
        connection.end();
    }
}
