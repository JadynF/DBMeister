'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtKey = process.env.JWT_SECRET as string;

export default async function authorization() : Promise<{ authorized: boolean, userData: unknown }> {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value || ''; // get token

    if (token == '') { // if no token exists
        redirect('/login');
        return ({ authorized: false, userData: null }); // still send response, CSR components still need
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtKey, (err: any, decoded: JwtPayload) => {
            if (err) { // if token fails to authorize
                console.log("JWT Error: " + err);
                redirect('/login');
                resolve ({ authorized: false, userData: null }); // this needs to be here for CSR components, if before redirect SSR components wont redirect
            }
            let userData = decoded.userData; // filter out sensitive data
            let filteredUserData = { username: userData.username,  firstName: userData.firstName, lastName: userData.lastName, email: userData.email, id: userData.id, isVerified: userData.isVerified }
            resolve({ authorized: true, userData: filteredUserData });
        });
    });
}
