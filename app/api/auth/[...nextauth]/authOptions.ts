import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { comparePasswords } from '@/lib/bcrypt';
import { createConnection } from '@/lib/db';

const findUserByUsername = async (username: string) => {
    const connection = createConnection();
    try {
        const [rows] = await connection.promise().query(
            'SELECT * FROM user_information WHERE username = ?',
            [username]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error querying the database: ' + err.message);
    } finally {
        connection.end();
    }
};

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await findUserByUsername(credentials.username);
                if (user && await comparePasswords(credentials.password, user.password)) {
                    return user;
                }
                return null;
            },
        }),
    ],
    secret: process.env.JWT_SECRET,
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
            }
            return session;
        },
    },
};

export default (req, res) => NextAuth(req, res, authOptions)