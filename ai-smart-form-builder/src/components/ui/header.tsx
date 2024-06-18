import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from './button';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

function SignOut() {
	return (
		<form
			action={async () => {
				await signOut();
			}}
		>
			<Button type='submit'>Sign out</Button>
		</form>
	);
}

const Header: React.FC<Props> = (props) => {
	const { data } = useSession();

	return (
		<header className='border bottom-1'>
			<nav className='bg-white border-gray-200 px-4 py-2.5'>
				<div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
					<h1>AI Form Builder</h1>
					<div>
						{data?.user ? (
							<div className='flex items-center gap-4'>
								<Link href='/view-forms'>
									<Button variant='outline'>Dashboard</Button>
								</Link>
								{data.user.name && data.user.image && (
									<Image
										src={data.user.image}
										alt={data.user.name}
										width={32}
										height={32}
										className='rounded-full'
									/>
								)}
								<SignOut />
							</div>
						) : (
							<Link href='/api/auth/signin'>
								<Button variant='link' onClick={() => signIn()}>
									Sign in
								</Button>
							</Link>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
