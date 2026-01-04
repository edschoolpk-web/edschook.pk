'use server';

import { prisma } from '@/lib/prisma';
import { generateCertificatePDF } from '@/lib/certificate-utils';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

const generateSchema = z.object({
    studentName: z.string().min(1, 'Student Name is required'),
    designation: z.string().min(1, 'Designation is required'),
    universityName: z.string().min(1, 'University Name is required'),
});

export async function generateCertificateAction(formData: FormData) {
    const rawData = {
        studentName: formData.get('studentName'),
        designation: formData.get('designation'),
        universityName: formData.get('universityName'),
    };

    const validatedFields = generateSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: 'Invalid input', details: validatedFields.error.flatten() };
    }

    const { studentName, designation, universityName } = validatedFields.data;

    // Generate Verify Code
    const verifyCode = crypto.randomBytes(16).toString('hex'); // 32 chars

    // Base URL
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000';

    // Ensure protocol exists because QR scanners need it to recognize a link
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`;
    }

    try {
        // Generate PDF
        const pdfBytes = await generateCertificatePDF({
            studentName,
            designation,
            universityName,
            verifyCode
        }, baseUrl);

        // We need to know the path to save in DB.
        const fileName = `${verifyCode}.pdf`;
        const publicDir = path.join(process.cwd(), 'public', 'certificates');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
        const filePath = path.join(publicDir, fileName);

        // Write file
        fs.writeFileSync(filePath, pdfBytes);

        const pdfUrl = `/certificates/${fileName}`;

        // Save to DB
        const certificate = await prisma.certificate.create({
            data: {
                studentName,
                designation,
                universityName,
                verifyCode,
                pdfPath: pdfUrl,
                status: 'VALID',
            },
        });

        revalidatePath('/admin/certificate');
        return { success: true, certificate };
    } catch (error) {
        console.error('Failed to generate certificate:', error);
        return { error: 'Failed to generate certificate', details: String(error) };
    }
}

export async function getCertificateByCode(code: string) {
    try {
        const cert = await prisma.certificate.findUnique({
            where: { verifyCode: code },
        });
        return cert;
    } catch (error) {
        console.error('Error fetching certificate:', error);
        return null;
    }
}

export async function revokeCertificateAction(verifyCode: string) {
    try {
        await prisma.certificate.update({
            where: { verifyCode },
            data: { status: 'REVOKED' },
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function restoreCertificateAction(verifyCode: string) {
    try {
        await prisma.certificate.update({
            where: { verifyCode },
            data: { status: 'VALID' },
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function getRecentCertificates() {
    try {
        const certs = await prisma.certificate.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        return certs;
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return [];
    }
}

export async function deleteCertificateAction(verifyCode: string) {
    try {
        // 1. Get the certificate to find the file path
        const cert = await prisma.certificate.findUnique({
            where: { verifyCode },
        });

        if (!cert) {
            return { success: false, error: 'Certificate not found' };
        }

        // 2. Delete file from filesystem if it exists
        if (cert.pdfPath) {
            // pdfPath is like '/certificates/CODE.pdf'
            // We need to resolve this to the absolute system path
            // relative path from public folder: 'certificates/CODE.pdf'

            // Remove leading slash if present
            const relativePath = cert.pdfPath.startsWith('/') ? cert.pdfPath.slice(1) : cert.pdfPath;
            const absolutePath = path.join(process.cwd(), 'public', relativePath);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        // 3. Delete from database
        await prisma.certificate.delete({
            where: { verifyCode },
        });

        // 4. Revalidate
        revalidatePath('/admin/certificate');

        return { success: true };
    } catch (error) {
        console.error('Delete certificate error:', error);
        return { success: false, error: String(error) };
    }
}
