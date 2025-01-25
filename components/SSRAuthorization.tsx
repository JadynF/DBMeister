import { authorizeUser } from '@/lib/authorization';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SSRAuthorize() : Promise<{ authorized: boolean, userData: unknown }> {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value || ''; // get token

    if (token == '') { // if no token exists
        redirect('/login');
    }

    const response = await authorizeUser(token);

    if (!response.authorized) { // if token is not authorized
        redirect('/login');
    }

    return response;
}