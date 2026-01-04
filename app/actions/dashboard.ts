"use server";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    try {
        const [teacherCount, galleryCount, activeNotice, recentTeachers] = await prisma.$transaction([
            prisma.teacher.count(),
            prisma.galleryImage.count(),
            prisma.notice.findFirst({ where: { isActive: true } }),
            prisma.teacher.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    role: true,
                    image: true,
                    slug: true,
                    createdAt: true
                }
            })
        ]);

        return {
            success: true,
            data: {
                counts: {
                    teachers: teacherCount,
                    gallery: galleryCount,
                    activeNotice: !!activeNotice
                },
                recentActivity: recentTeachers
            }
        };
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return { success: false, error: "Failed to load dashboard data" };
    }
}
