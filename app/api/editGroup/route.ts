import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const { groupId, name, description } = body;

    if (!groupId || !name) {
        return new Response(JSON.stringify({ response: "Invalid Request: Group ID and Name are required" }), {
            headers: { "Content-Type": "application/json" },
            status: 400
        });
    }

    const connection = createConnection();
    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(
                'UPDATE `groups` SET name = ?, group_desc = ? WHERE id = ?',
                [name, description || null, groupId],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        return new Response(JSON.stringify({ response: "Group Updated Successfully" }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (err) {
        console.error("Group Update Error:", err);
        return new Response(JSON.stringify({ response: "Group Update Error" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    } finally {
        connection.end();
    }
}
