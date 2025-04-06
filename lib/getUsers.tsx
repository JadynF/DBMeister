'use server';

import { redirect } from 'next/navigation';
import { createConnection } from '@/lib/db';

export default async function getUsersLike(groupId : string) : Promise<{ users : any }> {
    const connection = createConnection();

    console.log("getting users");

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT username, id FROM user_information;', [groupId, groupId], (err, results: any[]) => {
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