import GoogleProvider from 'next-auth/providers/google';
import type { Adapter } from 'next-auth/adapters';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db/index';
import { sessions } from './db/schema';

// Define a new interface that matches the DrizzleAdapter account type and includes an index signature
interface DrizzleAdapterAccount {
	type: 'email' | 'oidc' | 'oauth';
	userId: string;
	providerAccountId: string;
	provider: string;
	access_token?: string;
	token_type?: Lowercase<string>;
	id_token?: string;
	refresh_token?: string;
	scope?: string;
	expires_at?: number;
	session_state?: string;
	[key: string]: any; // Add index signature
}

const drizzleAdapter = DrizzleAdapter(db);

if (!drizzleAdapter) {
	throw new Error('Failed to initialize DrizzleAdapter');
}

// Mapping function for account types
const mapProviderType = (providerType: string): 'email' | 'oidc' | 'oauth' => {
	switch (providerType) {
		case 'email':
		case 'oidc':
		case 'oauth':
			return providerType;
		default:
			throw new Error(`Unsupported provider type: ${providerType}`);
	}
};

// Function to transform the account
const transformAccount = (account: any): DrizzleAdapterAccount => {
	const { type, token_type, ...rest } = account;
	return {
		type: mapProviderType(type),
		token_type: token_type?.toLowerCase() as Lowercase<string> | undefined,
		...rest,
	};
};

// Custom adapter to handle type compatibility
const CustomDrizzleAdapter: Adapter = {
	...drizzleAdapter,
	createUser: async (user) => {
		if (!drizzleAdapter.createUser) {
			throw new Error('createUser method is undefined in DrizzleAdapter');
		}
		const adapterUser = await drizzleAdapter.createUser({
			...user,
			id: '', // Provide a temporary id if needed, or ensure the id is set within DrizzleAdapter
		} as any);
		return adapterUser;
	},
	linkAccount: async (account) => {
		if (!drizzleAdapter.linkAccount) {
			throw new Error('linkAccount method is undefined in DrizzleAdapter');
		}
		const transformedAccount = transformAccount(account);
		return drizzleAdapter.linkAccount(
			transformedAccount as any
		) as Promise<void>;
	},
	unlinkAccount: async (providerAccountId) => {
		if (!drizzleAdapter.unlinkAccount) {
			throw new Error('unlinkAccount method is undefined in DrizzleAdapter');
		}
		return drizzleAdapter.unlinkAccount(
			providerAccountId as any as {
				provider: string;
				providerAccountId: string;
			}
		) as Promise<void>;
	},
	// Other methods can be similarly adapted as needed
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
	throw new Error('Missing Google OAuth client ID or secret');
}

export const authOptions = {
	adapter: CustomDrizzleAdapter,
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async session({ session, user }: { session: any; user: any }) {
			if (user && session?.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	debug: true,
};
