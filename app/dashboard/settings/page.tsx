import authorization from '@/lib/authorization';

export default async function Dashboard() {

    const response : any = await authorization();

    return (
        <div>
            Settings
            You are { response.userData.firstName } { response.userData.lastName }
        </div>
    );
}