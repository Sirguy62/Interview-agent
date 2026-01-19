// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});


async function main() {
  console.log("🌱 Seeding InterviewDefinitions...");

  const definitions = [
    // =========================
    // Frontend Engineering
    // =========================
    {
      track: "engineering",
      discipline: "software_engineering",
      role: "frontend_engineer",
      focus: "react",
      level: "JUNIOR",
      durationMinutes: 30,
      requiresScreenShare: true,
      rubricKey: "frontend_junior_react_v1",
    },
    {
      track: "engineering",
      discipline: "software_engineering",
      role: "frontend_engineer",
      focus: "react",
      level: "MID",
      durationMinutes: 45,
      requiresScreenShare: true,
      rubricKey: "frontend_mid_react_v1",
    },
    {
      track: "engineering",
      discipline: "software_engineering",
      role: "frontend_engineer",
      focus: "react",
      level: "SENIOR",
      durationMinutes: 60,
      requiresScreenShare: true,
      rubricKey: "frontend_senior_react_v1",
    },

    // =========================
    // Backend Engineering
    // =========================
    {
      track: "engineering",
      discipline: "software_engineering",
      role: "backend_engineer",
      focus: "nodejs",
      level: "JUNIOR",
      durationMinutes: 30,
      requiresScreenShare: true,
      rubricKey: "backend_junior_node_v1",
    },
    {
      track: "engineering",
      discipline: "software_engineering",
      role: "backend_engineer",
      focus: "nodejs",
      level: "MID",
      durationMinutes: 45,
      requiresScreenShare: true,
      rubricKey: "backend_mid_node_v1",
    },
    {
      track: "engineering",
      discipline: "software_engineering",
      role: "backend_engineer",
      focus: "nodejs",
      level: "SENIOR",
      durationMinutes: 60,
      requiresScreenShare: true,
      rubricKey: "backend_senior_node_v1",
    },

    // =========================
    // DevOps Engineering
    // =========================
    {
      track: "engineering",
      discipline: "devops_engineering",
      role: "devops_engineer",
      focus: "aws",
      level: "MID",
      durationMinutes: 60,
      requiresScreenShare: true,
      rubricKey: "devops_mid_aws_v1",
    },
  ];

  for (const def of definitions) {
    await prisma.interviewDefinition.upsert({
      where: {
        rubricKey: def.rubricKey,
      },
      update: {},
      create: def,
    });
  }

  console.log("✅ InterviewDefinitions seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
