"use client"; 
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function ClientLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname(); 

    useEffect(() => {
        setLoading(true); 

        
        const timer = setTimeout(() => {
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer); 
    }, [pathname]); 

    return (
        <>
            {loading ? <div className="flex items-center justify-center h-screen bg-background fixed inset-0 z-50">
                <Image
                height={30}
                width={30}
                    src='/load.png' 
                    alt="Loading..."
                    className="w-32 h-32 animate-spin" 
                />
        </div>: children} {/* Show loader while loading */}
        </>
    );
}

