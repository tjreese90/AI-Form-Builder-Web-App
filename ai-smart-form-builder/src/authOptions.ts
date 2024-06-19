import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db/index';

export const authOptions: NextAuthOptions = {
	adapter: DrizzleAdapter(db),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	callbacks: {
		async session({ session, user }) {
			if (user && session.user) {
				session.user.id = user.id ?? ''; // Ensure session.user.id is always a string
			}
			return session;
		},
		async signIn({ account, profile }) {
			if (account.provider === 'google') {
				if (profile?.email_verified && profile.email.endsWith('@example.com')) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		},
		async redirect({ url, baseUrl }) {
			return url.startsWith(baseUrl) ? url : baseUrl;
		},
		async jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
	events: {
		async error(message) {
			console.error('Error in authentication:', message);
		},
		async signIn(message) {
			console.log('SignIn event:', message);
		},
		async signOut(message) {
			console.log('SignOut event:', message);
		},
		async createUser(message) {
			console.log('CreateUser event:', message);
		},
		async linkAccount(message) {
			console.log('LinkAccount event:', message);
		},
		async session(message) {
			console.log('Session event:', message);
		},
	},
	secret: process.env.AUTH_SECRET,
	basePath: '/api/auth',
	debug: true,
};
