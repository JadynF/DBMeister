'use server';

import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_SECRET;

export const authorizeUser = async (token: string): Promise<{ authorized: boolean, userData: unknown }> => {
    console.log(token);
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtKey, (err, decoded) => {
            if (err) {
                console.log(err);
                resolve ({ authorized: false, userData: null }) // if token fails to authorize
            }
            let userData = decoded.userData; // filter out sensitive data
            let filteredUserData = { username: userData.username,  firstName: userData.firstName, lastName: userData.lastName, email: userData.email, id: userData.id, isVerified: userData.isVerified }
            resolve({ authorized: true, userData: filteredUserData }); // send userData if authorization succeeds
        })
    })
}