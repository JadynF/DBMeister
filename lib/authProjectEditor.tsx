'use server';

import { redirect } from 'next/navigation';
import { createConnection } from '@/lib/db';

export default async function authProject(userId : string, diagramId : string) : Promise<{ authorized: boolean }> {
    const connection = createConnection();

    console.log("here");

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT * FROM user_owns WHERE user_id = ? AND diagram_id = ?;', [userId, diagramId], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    
        console.log(response);

        if (response.length != 0)
            return ({authorized: true});

        redirect('/dashboard');
        return ({authorized: false});
    }
    catch (error) {
        console.log(error);
        redirect('/dashboard');
        return ({authorized: false});
    }
}