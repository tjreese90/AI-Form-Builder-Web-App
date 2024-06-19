import NextAuth, { type Session, type User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db/index';
import dotenv from 'dotenv';

dotenv.config();

export const authOptions = {
	adapter: DrizzleAdapter(db),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async session({ session, user }: { session: Session; user?: User }) {
			if (user && session?.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	debug: true,
};

export default NextAuth(authOptions);
