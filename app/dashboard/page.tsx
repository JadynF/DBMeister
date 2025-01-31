import authorization from '@/lib/authorization';


export default async function Dashboard() {

    const response = await authorization();

    return (
        <div>
            Dashboard
            You are { response.userData.firstName } { response.userData.lastName }
        </div>
    );
}