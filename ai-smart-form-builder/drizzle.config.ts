import { defineConfig } from 'drizzle-kit';
import 'dotenv/config'; // Ensure dotenv is imported to load the environment variables
import { parse } from 'pg-connection-string';

const { host, port, user, password, database } = parse(
	process.env.DATABASE_URL ||
		'postgres://postgres:postgres@localhost:5432/postgres'
);

export default defineConfig({
	dialect: 'postgresql', // Correct dialect for PostgreSQL
	schema: './src/db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		host: host || 'localhost',
		port: port ? parseInt(port, 10) : 5432,
		user: user || 'postgres',
		password: password || 'postgres',
		database: database || 'postgres',
		ssl: {
			rejectUnauthorized: false, // Allow self-signed certificates
		},
	},
});
