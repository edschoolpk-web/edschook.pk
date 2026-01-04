"use server";

import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updatePassword(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;

        if (!currentPassword || !newPassword) {
            return { success: false, error: "All fields are required" };
        }

        if (newPassword.length < 6) {
            return { success: false, error: "New password must be at least 6 characters" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const isPasswordValid = await compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return { success: false, error: "Incorrect current password" };
        }

        const hashedPassword = await hash(newPassword, 12);

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        });

        revalidatePath("/admin/settings");
        return { success: true, message: "Password updated successfully" };
    } catch (error) {
        console.error("Password update error:", error);
        return { success: false, error: "Failed to update password" };
    }
}

export async function createAdminUser(formData: FormData) {
    try {
        const session = await auth();
        // Only allow existing admins to create new admins (already protected by middleware but good for safety)
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name || !email || !password) {
            return { success: false, error: "All fields are required" };
        }

        if (password.length < 6) {
            return { success: false, error: "Password must be at least 6 characters" };
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, error: "User with this email already exists" };
        }

        const hashedPassword = await hash(password, 12);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "ADMIN" // Default to ADMIN
            }
        });

        revalidatePath("/admin/settings");
        return { success: true, message: "New admin user created successfully" };
    } catch (error) {
        console.error("Create user error:", error);
        return { success: false, error: "Failed to create user" };
    }
}
