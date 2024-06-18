import type { Config } from 'drizzle-kit';

export default {
	schema: './src/db/schema.ts',
	out: './drizzle',
	//@ts-ignore
	driver: 'pg',
	dbCredentials: {
		//@ts-ignore
		connectionString:
			process.env.DATABASE_URL ||
			'postgres://postgres:postgres@localhost:5432/postgres',
	},
} satisfies Config;
