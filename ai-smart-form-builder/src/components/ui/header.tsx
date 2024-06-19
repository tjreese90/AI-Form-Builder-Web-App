'use client';

import React, { useEffect, useState } from 'react';
import { signOut, getSession } from 'next-auth/react';
import { Button } from './button';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

function SignOut() {
	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<Button type='button' onClick={handleSignOut}>
			Sign out
		</Button>
	);
}

const Header: React.FC<Props> = () => {
	const [session, setSession] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const sessionData = await getSession();
				setSession(sessionData);
			} catch (err) {
				console.error('Error fetching session:', err);
				setError('Failed to fetch session data.');
			} finally {
				setLoading(false);
			}
		};
		fetchSession();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<header className='border bottom-1'>
			<nav className='bg-white border-gray-200 px-4 py-2.5'>
				<div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
					<h1>AI Form Builder</h1>
					<div>
						{session?.user ? (
							<div className='flex items-center gap-4'>
								<Link href='/view-forms'>
									<Button variant='outline'>Dashboard</Button>
								</Link>
								{session.user.name && session.user.image && (
									<Image
										src={session.user.image}
										alt={session.user.name}
										width={32}
										height={32}
										className='rounded-full'
									/>
								)}
								<SignOut />
							</div>
						) : (
							<Link href='/api/auth/signin'>
								<Button variant='link'>Sign in</Button>
							</Link>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
