import { createConnection } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
    const body = await req.json();
    const ownerId = body.owner;
    const name = body.name;
    const description = body.description;

    const connection = createConnection()
    try {
        let response = await new Promise<any[]>((resolve, reject) => {
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
            connection.query('INSERT INTO user_owns (user_id, diagram_id) VALUES(?, ?);', [ownerId, newDiagramId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })

        return new Response(JSON.stringify({response: "Creation Successful"}), {
            header: { "Content-Type": "application/json" },
            status: 200
        });
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({response: "Creation Error"}), {
            header: { "Content-Type": "application/json" },
            status: 500
        });
    }
    finally {
        connection.end();
    }

}