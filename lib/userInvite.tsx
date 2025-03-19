'use server';

import { createConnection } from '@/lib/db';

export default async function userInvite(userId : string, invitedUser : string, groupId : string) : Promise<{ invited: boolean }> {
    const connection = createConnection();

    console.log("here");

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT id FROM user_information;', [], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        console.log(response);
        let userExists = false;
        for (let user in response) {
            console.log(response[user].id);
            if (response[user].id == invitedUser) {
                console.log("user exists");
                userExists = true;
                break;
            }
        }

        if (!userExists) {
            console.log("user does not exist");
            return ({invited: false, res: "no user"});
        }

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('INSERT INTO invite (sendId, recvId, groupId) VALUES (?, ?, ?);', [userId, invitedUser, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    
        console.log(response);

        if (response.length != 0)
            return ({invited: true});

        return ({invited: false});
    }
    catch (error) {
        console.log(error);
        return ({invited: false});
    }
    finally {
        connection.end();
    }
}