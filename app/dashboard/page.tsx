import SSRAuthorize from '@/components/SSRAuthorization';

export default async function Dashboard() {

    const response = await SSRAuthorize(); // get authorization

    return (
        <div>
            Dashboard
            You are { response.userData.firstName } { response.userData.lastName }
        </div>
    );
}