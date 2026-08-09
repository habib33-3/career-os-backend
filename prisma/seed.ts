/* eslint-disable no-console */
/* eslint-disable no-process-exit */
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

import { hashPassword } from "../src/common/security/password";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";
import { generateAvatar } from "../src/modules/auth/util/generate-avatar";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not defined.");
}

const isLocalDatabase =
    dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

if (!isLocalDatabase) {
    throw new Error(
        "Refusing to seed a non-local database. DATABASE_URL must point to localhost or 127.0.0.1."
    );
}

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: dbUrl,
    }),
    log: ["warn", "error"],
});

const DEFAULT_PASSWORD = "123456";

async function clearDatabase() {
    console.log("🗑️  Clearing database...");

    await prisma.$transaction([
        prisma.source.deleteMany(),
        prisma.user.deleteMany(),
    ]);

    console.log("✅ Database cleared");
}

async function seedUsers() {
    console.log("👤 Seeding users...");

    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: "Admin",
                email: "admin@example.com",
                role: UserRole.ADMIN,
                password: hashedPassword,
                image: generateAvatar("Admin"),
            },
        }),
        prisma.user.create({
            data: {
                name: "Alice",
                email: "alice@example.com",
                role: UserRole.USER,
                password: hashedPassword,
                image: generateAvatar("Alice"),
            },
        }),
        prisma.user.create({
            data: {
                name: "Bob",
                email: "bob@example.com",
                role: UserRole.USER,
                password: hashedPassword,
                image: generateAvatar("Bob"),
            },
        }),
    ]);

    console.log(`✅ Created ${users.length} users`);
}

async function seedSources() {
    console.log("📚 Seeding sources...");

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
        },
    });

    const userMap = new Map(users.map((user) => [user.email, user.id]));

    const result = await prisma.source.createMany({
        data: [
            {
                name: "GitHub",
                url: "https://github.com",
                userId: userMap.get("admin@example.com")!,
            },
            {
                name: "NestJS",
                url: "https://nestjs.com",
                userId: userMap.get("admin@example.com")!,
            },
            {
                name: "Medium",
                url: "https://medium.com",
                userId: userMap.get("alice@example.com")!,
            },
            {
                name: "Dev.to",
                url: "https://dev.to",
                userId: userMap.get("alice@example.com")!,
            },
            {
                name: "Reddit",
                url: "https://reddit.com",
                userId: userMap.get("bob@example.com")!,
            },
            {
                name: "Hashnode",
                url: "https://hashnode.com",
                userId: userMap.get("bob@example.com")!,
            },
        ],
    });

    console.log(`✅ Created ${result.count} sources`);
}

async function seed() {
    console.log("🌱 Starting database seed...\n");

    await clearDatabase();

    await seedUsers();
    await seedSources();

    console.log("\n🎉 Database seeded successfully!");
    console.log(`🔑 Default user password: ${DEFAULT_PASSWORD}`);
}

seed()
    .catch((error) => {
        console.error("\n❌ Seed failed");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
