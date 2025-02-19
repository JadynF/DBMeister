'use server';

import { createConnection } from '@/lib/db';

export async function saveProject(state : any, id : any) : Promise<{ saved: boolean }> {
    const connection = createConnection();

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('UPDATE diagrams SET state = ? WHERE id = ?;', [JSON.stringify(state), id], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return {saved: true};
    }
    catch (error) {
        console.log(error);
        return {saved: false};
    }
}

export async function getProject(id : any) : Promise<any> {
    const connection = createConnection();

    try {
        let response = await new Promise<any[]>((resolve, reject) => {
            connection.query('SELECT state FROM diagrams WHERE id = ?', [id], (err, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        console.log(response);

        return JSON.parse(response[0].state);
    }
    catch (error) {
        console.log(error);
        return {saved: false};
    }
    finally {
        connection.end();
    }
}