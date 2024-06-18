import NextAuth from 'next-auth';
import { authOptions } from '@/auth';

const handler = NextAuth(authOptions);

// Export named handlers for each HTTP method
export const GET = handler;
export const POST = handler;
