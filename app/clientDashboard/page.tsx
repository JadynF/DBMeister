'use client';
import CSRAuthorize from '@/components/CSRAuthorization';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function Dashboard() {

    const [username, setUsername] = useState<string>(null);

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const authResponse = await CSRAuthorize(); // get authorization status

            if (!authResponse.authorized)
                router.push('/login'); // return to login if not authorized
            else {
                setUsername(authResponse.userData.username);
            }
        };

        checkAuth();
    }, []);

    return (
        <div>
            Dashboard
            You are {username}
        </div>
    );
}