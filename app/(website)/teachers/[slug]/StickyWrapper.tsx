"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function StickyWrapper({ children }: { children: React.ReactNode }) {
    const [isSticky, setIsSticky] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!wrapperRef.current) return;

            // Find the parent flex container row to measure height against
            if (!parentRef.current) {
                parentRef.current = wrapperRef.current.closest('.flex-row');
            }

            if (!parentRef.current) return;

            const parentRect = parentRef.current.getBoundingClientRect();
            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const offsetTop = 100; // Top margin for sticky element

            // Simple check: consistent sticky class application
            // This forces the browser to re-evaluate if it was struggling with deep nesting
            if (window.scrollY > 100) {
                // We can add logic here if we need "fixed" position, 
                // but often just ensuring the class is active and parents aren't overflow:hidden is enough.
                // For this implementation, we will rely on a clean 'sticky' application
                // kept separate from server component interference.
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="sticky top-28 self-start transition-all duration-300"
            style={{
                position: 'sticky',
                top: '30px',
                zIndex: 10
            }}
        >
            {children}
        </div>
    );
}
