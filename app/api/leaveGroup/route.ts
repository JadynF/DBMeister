import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const userId = body.userId;
    const groupId = body.groupId;

    const connection = createConnection();
    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM user_group WHERE user_id = ? AND group_id = ? AND user_id NOT IN (SELECT admin_id FROM `groups` WHERE id = ?);', [userId, groupId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (response.affectedRows > 0)
            return new Response(JSON.stringify({ response: "Left group" }), {
                headers: { "Content-Type": "application/json" },
                status: 200
            });
        else
            return new Response(JSON.stringify({ response: "Error" }), {
                headers: { "Content-Type": "application/json" },
                status: 500
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
