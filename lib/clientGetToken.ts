'use client';

import { useEffect, useState } from 'react';

export default function GetToken() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, []);

    return token;
}