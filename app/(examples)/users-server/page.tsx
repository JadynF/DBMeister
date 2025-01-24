type User = {
    id: number,
    name: string,
    username: string,
    email: string,
    phone: string
}

export default async function UsersServer() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const res = await fetch("https://jsonplaceholder.typicode.com/users"); //add 123 to test error rendering
    const users = await res.json();

    return (
        <ul className="space-y-4 p-4">
            {users.map((user: User) => (
                <li key={user.id} className="p-4 big-white shadow-md rounded-lg text-gray-700">
                    {user.name} ({user.email})
                </li>
            ))}
        </ul>
    )
}