import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const id = body.id;
    const name = body.name;
    const description = body.description;

    const connection = createConnection()
    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('UPDATE diagrams SET name = ?, description = ? WHERE id = ?;', [name, description, id], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return new Response(JSON.stringify({response: "Edit Successful"}), {
            header: { "Content-Type": "application/json" },
            status: 200
        });
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({response: "Edit Error"}), {
            header: { "Content-Type": "application/json" },
            status: 500
        });
    }
    finally {
        connection.end();
    }

}