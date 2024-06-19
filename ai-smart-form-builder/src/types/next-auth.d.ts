import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession['user'];
	}

	interface User extends DefaultUser {
		id: string;
	}

	interface NextAuthOptions {
		adapter: any;
		providers: any[];
		callbacks: {
			session: (params: { session: Session; user: User }) => Promise<Session>;
			signIn: (params: {
				account: Account;
				profile?: Profile;
			}) => Promise<boolean | null | undefined>;
			redirect: (params: { url: string; baseUrl: string }) => Promise<string>;
			jwt: (params: {
				token: JWT;
				account?: Account;
				user?: User;
				profile?: Profile;
				isNewUser?: boolean;
			}) => Promise<JWT>;
		};
		events: {
			error: (message: any) => Promise<void>;
			signIn: (message: any) => Promise<void>;
			signOut: (message: any) => Promise<void>;
			createUser: (message: any) => Promise<void>;
			linkAccount: (message: any) => Promise<void>;
			session: (message: any) => Promise<void>;
		};
		secret?: string;
		basePath?: string;
		debug?: boolean;
	}
}

export {};
