const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const sqlitePath = path.join(__dirname, '..', 'prisma', 'dev.db');

async function migrate() {
    console.log(`Reading from SQLite: ${sqlitePath}`);
    const db = new Database(sqlitePath, { readonly: true });

    try {
        // 1. Users
        console.log('Migrating Users...');
        const users = db.prepare('SELECT * FROM User').all();
        if (users.length > 0) {
            // Create many is efficient
            await prisma.user.createMany({
                data: users.map(u => ({
                    ...u,
                    createdAt: new Date(u.createdAt),
                    updatedAt: new Date(u.updatedAt)
                })),
                skipDuplicates: true,
            });
            console.log(`Migrated ${users.length} Users`);
        }

        // 2. Teachers
        console.log('Migrating Teachers...');
        const teachers = db.prepare('SELECT * FROM Teacher').all();
        if (teachers.length > 0) {
            await prisma.teacher.createMany({
                data: teachers.map(t => ({
                    ...t,
                    createdAt: new Date(t.createdAt),
                    updatedAt: new Date(t.updatedAt)
                })),
                skipDuplicates: true,
            });
            console.log(`Migrated ${teachers.length} Teachers`);
        }

        // 3. Skills
        console.log('Migrating Skills...');
        const skills = db.prepare('SELECT * FROM Skill').all();
        if (skills.length > 0) {
            await prisma.skill.createMany({
                data: skills,
                skipDuplicates: true,
            });
            console.log(`Migrated ${skills.length} Skills`);
        }

        // 4. Socials
        console.log('Migrating Socials...');
        const socials = db.prepare('SELECT * FROM Social').all();
        if (socials.length > 0) {
            await prisma.social.createMany({
                data: socials,
                skipDuplicates: true,
            });
            console.log(`Migrated ${socials.length} Socials`);
        }

        // 5. GalleryImages
        console.log('Migrating GalleryImages...');
        const galleryImages = db.prepare('SELECT * FROM GalleryImage').all();
        if (galleryImages.length > 0) {
            await prisma.galleryImage.createMany({
                data: galleryImages.map(g => ({
                    ...g,
                    createdAt: new Date(g.createdAt)
                })),
                skipDuplicates: true,
            });
            console.log(`Migrated ${galleryImages.length} GalleryImages`);
        }

        // 6. Notices
        console.log('Migrating Notices...');
        const notices = db.prepare('SELECT * FROM Notice').all();
        if (notices.length > 0) {
            await prisma.notice.createMany({
                data: notices.map(n => ({
                    ...n,
                    isActive: Boolean(n.isActive), // SQLite stores booleans as integers (0/1) usually, but better-sqlite3 might return number
                    startDate: n.startDate ? new Date(n.startDate) : null,
                    endDate: n.endDate ? new Date(n.endDate) : null,
                    createdAt: new Date(n.createdAt),
                    updatedAt: new Date(n.updatedAt)
                })),
                skipDuplicates: true,
            });
            console.log(`Migrated ${notices.length} Notices`);
        }

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        db.close();
        await prisma.$disconnect();
    }
}

migrate();
