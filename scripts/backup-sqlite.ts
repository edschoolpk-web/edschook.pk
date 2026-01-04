import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting backup...');

    const data = {
        users: await prisma.user.findMany(),
        teachers: await prisma.teacher.findMany(),
        skills: await prisma.skill.findMany(),
        socials: await prisma.social.findMany(),
        galleryImages: await prisma.galleryImage.findMany(),
        notices: await prisma.notice.findMany(),
    };

    const backupPath = path.join(process.cwd(), 'data-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
    console.log(`Backup completed! Data saved to ${backupPath}`);
    console.log(`Summary:`);
    console.log(`- Users: ${data.users.length}`);
    console.log(`- Teachers: ${data.teachers.length}`);
    console.log(`- Skills: ${data.skills.length}`);
    console.log(`- Socials: ${data.socials.length}`);
    console.log(`- GalleryImages: ${data.galleryImages.length}`);
    console.log(`- Notices: ${data.notices.length}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
