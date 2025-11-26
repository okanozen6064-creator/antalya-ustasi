'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Sayfa değiştiğinde veya yenilendiğinde tepeye çık
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        // Tarayıcının "kaldığın yerden devam et" özelliğini kapat
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    return null;
}
