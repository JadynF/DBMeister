import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const ownerId = body.id;

    const connection = createConnection();
    
    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM diagrams WHERE id IN (SELECT diagram_id FROM user_owns WHERE user_id = ?);', [ownerId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    
        return new Response(JSON.stringify({response: "Fetched Diagrams", data: response}), {
            header: { "Content-Type": "application/json" },
            status: 200
        });
    }
    catch (err) {
        return new Response(JSON.stringify({response: "Failed to Fetch Diagrams"}), {
            header: { "Content-Type": "application/json" },
            status: 500
        });
    }
    finally {
        connection.end();
    }
};