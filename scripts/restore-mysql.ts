import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting restore to MySQL...');

    const backupPath = path.join(process.cwd(), 'data-backup.json');
    if (!fs.existsSync(backupPath)) {
        console.error('Backup file not found!');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // Order matters due to foreign keys

    // 1. Users
    console.log('Restoring Users...');
    for (const user of data.users) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: user,
        });
    }

    // 2. Teachers
    console.log('Restoring Teachers...');
    for (const teacher of data.teachers) {
        // Separate relations if they exist in the backup object
        const { skills, socials, ...teacherData } = teacher;
        await prisma.teacher.upsert({
            where: { id: teacher.id },
            update: {},
            create: teacherData,
        });
    }

    // 3. Skills
    console.log('Restoring Skills...');
    for (const skill of data.skills) {
        await prisma.skill.create({
            data: skill // IDs are CUIDs so we can just create, or upsert if needed. Create is safer for clean DB.
        });
    }

    // 4. Socials
    console.log('Restoring Socials...');
    for (const social of data.socials) {
        await prisma.social.create({
            data: social
        });
    }

    // 5. Gallery
    console.log('Restoring Gallery...');
    for (const img of data.galleryImages) {
        await prisma.galleryImage.upsert({
            where: { id: img.id },
            update: {},
            create: img,
        });
    }

    // 6. Notices
    console.log('Restoring Notices...');
    for (const notice of data.notices) {
        await prisma.notice.upsert({
            where: { id: notice.id },
            update: {},
            create: notice,
        });
    }

    console.log('Restore completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
