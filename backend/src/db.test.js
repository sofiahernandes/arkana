// Small smoke test for the database layer so connectivity issues fail fast during development.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Performs a minimal write/read cycle to confirm the Prisma connection is working in the current environment.
async function tryConnection() {
  try {
    const Admin = await prisma.mentor.create({
      data: {
        EmailMentor: "",
        SenhaMentor: "",
        IsAdmin: "",
      },
    });

    console.log("Mentor criado:", Admin);

    const admin = await prisma.mentor.findMany();
    console.log("Mentores no banco:", admin);
  } catch (err) {
    console.error("Erro de conexão:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

tryConnection();
