import authorization from '@/lib/authorization';

export default async function Dashboard() {

    const response : any = await authorization();

    return (
        <div>
            Groups
            You are { response.userData.firstName } { response.userData.lastName }
        </div>
    );
}