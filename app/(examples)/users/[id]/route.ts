import { users } from "../route";
export async function GET(
    //Underscore in front of 'req' specifies we don't want to use it
    _req: Request, 
    { params }: { params: { id: string }}
) {
    const { id } = await params;
    const user = users.find((user) => user.id === parseInt(id));

    return Response.json(user);
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string }}
) {
    const { id } = await params;
    const userIndex = users.findIndex((user) => user.id === parseInt(id));
    const deletedUser = users.splice(userIndex, 1)[0];

    return Response.json(users);
}