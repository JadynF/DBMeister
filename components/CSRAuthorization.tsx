'use client';
import { authorizeUser } from '@/lib/authorization';
import Cookies from 'js-cookie';


export default async function CSRAuthorize() : Promise<{ authorized: boolean, userData: unknown}> {
    const token = Cookies.get('token');
    if (!token) { // if no token exists
        return ({ authorized: false, userData: null });
    }

    const response = await authorizeUser(token); // if token exists, check it

    return response;
}