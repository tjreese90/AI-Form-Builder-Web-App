'use server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { forms } from '@/db/schema';
import { auth } from '@/auth';

export async function getUserForms() {
	console.debug('Fetching session...');
	const session = await auth();
	console.debug('Session:', session);

	const userId = session?.user?.id;
	console.debug('User ID:', userId);

	if (!userId) {
		console.warn('User ID is not defined');
		return [];
	}

	console.debug('Fetching user forms...');
	const userForms = await db.query.forms.findMany({
		where: eq(forms.userId, userId),
	});
	console.debug('User Forms:', userForms);

	return userForms;
}
