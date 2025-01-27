'use client';
import authorization from '@/lib/authorization';
import { useState, useEffect } from 'react';

export default function Dashboard() {

    const [username, setUsername] = useState<string>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const authResponse = await authorization(); // get authorization status

            if (authResponse) {
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