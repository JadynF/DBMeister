import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const ownerId = body.owner;
    const name = body.name;
    const description = body.description;

    const connection = createConnection()
    try {
        let response = await new Promise<any>((resolve, reject) => {
            connection.query('INSERT INTO `groups` (name, admin_id, group_desc) VALUES (?, ?, ?);', [name, ownerId, description], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const newGroupId = response.insertId
        console.log("New Group ID: " + newGroupId);

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('INSERT INTO user_group (user_id, group_id) VALUES(?, ?);', [ownerId, newGroupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })

        return new Response(JSON.stringify({response: "Creation Successful"}), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({response: "Creation Error"}), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
    finally {
        connection.end();
    }

}