import { createConnection } from '@/lib/db';

// Handle POST requests to create a new post
export async function POST(req: Request) {
    const body = await req.json();
    const userId = body.userId;
    const title = body.title;
    const text = body.text;
    const date_made = new Date().toISOString().split('T')[0];

    const connection = await createConnection();
    try {
        // Insert forum question into the database
        const response = await new Promise<any[]>((resolve, reject) => {
            connection.query(
                'INSERT INTO forum_question (user_id, title, text, date_made, solved) VALUES (?, ?, ?, ?, 0);',
                [userId, title, text, date_made],
                (err, results: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        return new Response(JSON.stringify({ response: "Creation Successful" }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ response: "Creation Error" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    } finally {
        connection.end();
    }
}

// Handle GET requests to fetch all posts
export async function GET(req: Request) {
    const connection = await createConnection();
    try {
        const posts = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM forum_question ORDER BY date_made DESC;', (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return new Response(JSON.stringify({ posts }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    } finally {
        connection.end();
    }
}

export async function OPTIONS() {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
    });
  }

// Handle DELETE requests to delete a post
export async function DELETE(req: Request) {
    const { id } = await req.json(); // Expecting { id: number }
    const connection = await createConnection();
    try {
      const response = await new Promise<any[]>((resolve, reject) => {
        connection.query(
          'DELETE FROM forum_question WHERE id = ?;',
          [id],
          (err, results: any[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
  
      return new Response(JSON.stringify({ response: "Deletion Successful" }), {
        headers: { "Content-Type": "application/json" },
        status: 200
      });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ response: "Deletion Error" }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    } finally {
      connection.end();
    }
  }
