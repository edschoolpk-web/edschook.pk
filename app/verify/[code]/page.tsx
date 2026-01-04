import React from 'react';
import { getCertificateByCode } from '@/app/actions/certificate';
import { notFound } from 'next/navigation';

interface VerifyPageProps {
    params: Promise<{
        code: string;
    }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
    const { code } = await params;

    if (!code) {
        notFound();
    }

    const certificate = await getCertificateByCode(code);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header Color Bar */}
                <div className={`h-4 w-full ${!certificate ? 'bg-gray-400' :
                    certificate.status === 'VALID' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>

                <div className="p-8 text-center">
                    {/* Status Icon */}
                    <div className={`mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full ${!certificate ? 'bg-gray-100 text-gray-400' :
                        certificate.status === 'VALID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {!certificate ? (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ) : certificate.status === 'VALID' ? (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {!certificate ? 'Certificate Not Found' :
                            certificate.status === 'VALID' ? 'Verified Certificate' : 'Certificate Revoked'}
                    </h1>

                    <p className="text-gray-500 mb-8">
                        {!certificate ? `The verification code "${code}" does not exist in our records.` :
                            certificate.status === 'VALID' ? 'This certificate is valid and authentic.' :
                                'This certificate has been revoked and is no longer valid.'}
                    </p>

                    {certificate && (
                        <div className="text-left bg-gray-50 rounded-lg p-6 border border-gray-100 space-y-4">
                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Student Name</label>
                                <p className="text-lg font-medium text-gray-900">{certificate.studentName}</p>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Designation</label>
                                <p className="text-lg font-medium text-gray-900">{certificate.designation}</p>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">University</label>
                                <p className="text-base text-gray-700">{certificate.universityName}</p>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Verification Code</label>
                                <p className="font-mono text-sm text-gray-600 break-all">{certificate.verifyCode}</p>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Issued On</label>
                                <p className="text-sm text-gray-600">{new Date(certificate.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}

                    {certificate && certificate.pdfPath && (
                        <div className="mt-6">
                            <a href={certificate.pdfPath} target="_blank" className="!text-black font-medium text-sm inline-flex items-center gap-1">
                                View Original PDF
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Engineers & Doctors School</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
