"use client";

import React from 'react';
import CertificateGenerator from '@/components/admin/CertificateGenerator';
import CertificateList from '@/components/admin/CertificateList';

interface CertificateAdminClientProps {
    initialCertificates: any[];
}

export default function CertificateAdminClient({ initialCertificates }: CertificateAdminClientProps) {
    return (
        <div className="page-container p-8">
            <div className="page-header mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#2B3674]">Certificate Generator</h1>
                    <p className="text-[#A3AED0] mt-1">Create, preview, and issue certificates.</p>
                </div>
            </div>

            <style jsx>{`
                .page-container { animation: fadeIn 0.5s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <CertificateGenerator />

            <div className="mt-12">
                <CertificateList initialCertificates={initialCertificates} />
            </div>
        </div>
    );
}
