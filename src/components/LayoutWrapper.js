'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    const isCleanLayout = pathname.startsWith('/admin');

    if (isCleanLayout) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
