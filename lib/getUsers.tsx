'use server';

import { redirect } from 'next/navigation';
import { createConnection } from '@/lib/db';

export default async function getUsersLike(groupId : string) : Promise<{ users : any }> {
    const connection = createConnection();

    console.log("getting users");
    console.log(groupId);

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT username, id FROM user_information WHERE id NOT IN (SELECT user_id FROM user_group WHERE group_id = ?) AND id NOT IN (SELECT recvId FROM invite WHERE groupId = ?);', [groupId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    
        console.log(response);

        if (response.length == 0)
            return ({ users: "None" });

        return ({ users: response });
    }
    catch (error) {
        console.log(error);
        return ({users: "None"});
    }
    finally {
        connection.end();
    }
}