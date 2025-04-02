'use server';

import { redirect } from 'next/navigation';
import { createConnection } from '@/lib/db';

export default async function authGroup(userId : string, groupId : string) : Promise<[{ authorized: boolean }, any]> {
    const connection = createConnection();

    console.log("Authorizing Group");

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM user_group WHERE user_id = ? AND group_id = ?;', [userId, groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    
        console.log("First response:");
        console.log(response);

        if (response.length == 0) {
            redirect('/dashboard');
            return ([{authorized: false}]);
        }

        let data = [];

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM `groups` WHERE id = ?;', [groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        data[0] = response[0];

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM diagrams WHERE id IN (SELECT diagram_id FROM group_owns WHERE group_id = ?);', [groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        data[1] = response;

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT id, username, email FROM user_information WHERE id in (SELECT recvId FROM invite WHERE groupId = ?);', [groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })

        data[2] = response;

        response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT id, username, email FROM user_information WHERE id in (SELECT user_id FROM user_group WHERE group_id = ?);', [groupId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })

        data[3] = response;

        console.log("authGroup:");
        console.log(data);

        return ([{authorized: true}, data]);
    }
    catch (error) {
        console.log(error);
        redirect('/dashboard');
        return ([{authorized: false}]);
    }
    finally {
        connection.end();
    }
}