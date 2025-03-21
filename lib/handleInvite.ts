'use server'

import { createConnection } from '@/lib/db';

export async function acceptInvite(userId : string, groupId : string) : Promise<{ accepted: boolean }> {
    const connection = createConnection();

    console.log("Group Id join: " + groupId);

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM invite WHERE recvId = ? AND groupId = ?;', [userId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (response.length == 0)
            return ({accepted: false});

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('INSERT INTO user_group (user_id, group_id) VALUES (?, ?);', [userId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        console.log(response);
        if (response.length == 0)
            return ({accepted: false});

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM invite WHERE recvId = ? and groupId = ?;', [userId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        console.log(response);
        if (response.length == 0)
            return ({accepted: false});

        console.log("Accepted Invite Successfully");
        return ({accepted: true});
    }
    catch (error) {
        console.log(error);
        return ({accepted: false});
    }
    finally {
        connection.end();
    }
};

export async function declineInvite(userId : string, groupId : string) : Promise<{ accepted: boolean }> {
    const connection = createConnection();

    console.log("Group Id join: " + groupId);

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM invite WHERE recvId = ? AND groupId = ?;', [userId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (response.length == 0)
            return ({accepted: false});

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('DELETE FROM invite WHERE recvId = ? and groupId = ?;', [userId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        console.log(response);
        if (response.length == 0)
            return ({declined: false});

        console.log("Declined Invite Successfully");
        return ({declined: true});
    }
    catch (error) {
        console.log(error);
        return ({declined: false});
    }
    finally {
        connection.end();
    }
}