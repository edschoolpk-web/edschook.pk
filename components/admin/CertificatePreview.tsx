'use client';

import React, { useEffect, useState, useRef } from 'react';

interface CertificatePreviewProps {
    studentName: string;
    designation: string;
    universityName: string;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
    studentName,
    designation,
    universityName,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            const newScale = width / 2000;

            // Prevent infinite loops by checking for significant changes
            setScale(prev => {
                if (Math.abs(prev - newScale) < 0.002) return prev;
                return newScale;
            });
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // PDF Coords (2000 x 1414)
    // Origin top-left.

    // 1) Student Name: Baseline 720. Font 64.
    // 2) Designation: Baseline 800. Font 40.
    // 3) University: Baseline 860. Font 34.
    // 4) QR: 1870, 1284. Size 100.

    return (
        <div
            className="w-full bg-gray-100 border rounded-lg relative"
            ref={containerRef}
            style={{
                height: containerRef.current ? (containerRef.current.offsetWidth / 2000) * 1414 : 'auto',
                overflow: 'hidden',
                transition: 'height 0.1s ease-out'
            }}
        >
            <div
                style={{
                    width: '2000px',
                    height: '1414px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    position: 'absolute', // Absolute positioning to prevent flow issues
                    top: 0,
                    left: 0,
                    backgroundImage: 'url(/webImages/Certificate.jpg)',
                    backgroundSize: 'cover',
                }}
            >
                {/* Student Name */}
                <div
                    style={{
                        position: 'absolute',
                        top: '770px',
                        left: 0,
                        width: '2000px',
                        textAlign: 'center',
                        fontSize: '70px',
                        fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
                        color: '#000000',
                        fontWeight: 'bold',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        transform: 'translateY(-100%)', // Sits on the line
                    }}
                >
                    {studentName || 'STUDENT NAME'}
                </div>

                {/* Designation */}
                <div
                    style={{
                        position: 'absolute',
                        top: '860px',
                        left: 0,
                        width: '2000px',
                        textAlign: 'center',
                        fontSize: '35px',
                        fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
                        color: '#000000',
                        fontWeight: 'normal',
                        lineHeight: 1,
                        transform: 'translateY(-100%)',
                    }}
                >
                    {designation || 'Designation'}
                </div>

                {/* University Name */}
                <div
                    style={{
                        position: 'absolute',
                        top: '930px',
                        left: 0,
                        width: '2000px',
                        textAlign: 'center',
                        fontSize: '35px',
                        fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
                        color: '#000000',
                        fontWeight: 'normal',
                        lineHeight: 1,
                        transform: 'translateY(-100%)',
                    }}
                >
                    {universityName || 'University Name'}
                </div>

                {/* QR Code Placeholder */}
                <div
                    style={{
                        fontSize: '10px',
                        border: '1px dashed #000',
                        position: 'absolute', // Ensure absolute pos
                        left: '1770px',
                        top: '1184px',
                        width: '200px',
                        height: '200px',
                    }}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        QR Preview
                        {/* Favicon Overlay */}
                        <div
                            style={{
                                position: 'absolute',
                                width: '25px',
                                height: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img src="/webImages/favicon.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CertificatePreview;
