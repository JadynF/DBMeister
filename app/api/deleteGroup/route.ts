import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const groupId = body.groupId;

    const connection = createConnection();
    try {
        // Delete related records in user_group
        await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM user_group WHERE group_id = ?', [groupId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Delete related records in group_owns
        await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM group_owns WHERE group_id = ?', [groupId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Finally, delete the group itself
        await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM `groups` WHERE id = ?', [groupId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return new Response(JSON.stringify({ response: "Group Deletion Successful" }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (err) {
        console.error("Group Deletion Error:", err);
        return new Response(JSON.stringify({ response: "Group Deletion Error" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    } finally {
        connection.end();
    }
}
