import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const groupId = body.group;
    const name = body.name;
    const description = body.description;

    const connection = createConnection()
    try {
        let response = await new Promise<any>((resolve, reject) => {
            connection.query('INSERT INTO diagrams (name, description) VALUES(?, ?);', [name, description], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const newDiagramId = response.insertId

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('INSERT INTO group_owns (group_id, diagram_id) VALUES(?, ?);', [groupId, newDiagramId], (err, results: any[]) => {
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