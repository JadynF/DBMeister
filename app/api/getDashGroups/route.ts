import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.json();
    const ownerId = body.id;

    const connection = createConnection();
    
    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM `groups` WHERE id IN (SELECT group_id FROM user_group WHERE user_id = ?);', [ownerId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        let returnData = [];
        returnData[0] = response;

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT invite.*, `groups`.name, `groups`.group_desc, `groups`.date_made, user_information.username FROM invite JOIN `groups` on invite.groupId = `groups`.id JOIN user_information on invite.sendId = user_information.id WHERE invite.recvId = ?;', [ownerId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });       
        

        returnData[1] = response;
    
        return new Response(JSON.stringify({response: "Fetched Groups", data: returnData}), {
            header: { "Content-Type": "application/json" },
            status: 200
        });
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({response: "Failed to Fetch Groups"}), {
            header: { "Content-Type": "application/json" },
            status: 500
        });
    }
    finally {
        connection.end();
    }
};