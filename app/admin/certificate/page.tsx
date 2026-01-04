import React from 'react';
import { getRecentCertificates } from '@/app/actions/certificate';
import CertificateAdminClient from '@/components/admin/CertificateAdminClient';

export const dynamic = 'force-dynamic'; // Ensure it fetches fresh data

export default async function CertificateAdminPage() {
    const recentCertificates = await getRecentCertificates();

    // Serialize dates and select only needed fields to avoid Date object issues
    const serializedCertificates = recentCertificates.map(cert => ({
        id: cert.id,
        studentName: cert.studentName,
        designation: cert.designation,
        universityName: cert.universityName,
        verifyCode: cert.verifyCode,
        status: cert.status,
        pdfPath: cert.pdfPath,
        createdAt: cert.createdAt.toLocaleDateString('en-GB')
    }));

    return <CertificateAdminClient initialCertificates={serializedCertificates} />;
}
