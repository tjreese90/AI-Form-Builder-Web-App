'use client';

import { SessionProvider } from 'next-auth/react';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
	return <SessionProvider>{children}</SessionProvider>;
};

export default ClientLayout;
