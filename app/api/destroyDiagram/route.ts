import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const id = body.id;

    const connection = createConnection()
    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM user_owns WHERE diagram_id = ?', [id], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM group_owns WHERE diagram_id = ?', [id], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM diagrams WHERE id = ?', [id], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return new Response(JSON.stringify({response: "Deletion Successful"}), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({response: "Deletion Error"}), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
    finally {
        connection.end();
    }

}