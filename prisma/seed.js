require("dotenv").config();

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient, ServiceType } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the Prisma seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const services = [
  {
    type: ServiceType.DIAGNOSTICS,
    name: "Diagnostics Scan",
    description: "Computer-assisted fault scan with advisor-ready notes for warning lights and drivability issues.",
  },
  {
    type: ServiceType.OIL_CHANGE,
    name: "Oil Service",
    description: "Synthetic oil and filter replacement with a quick workshop health check before handoff.",
  },
  {
    type: ServiceType.MAINTENANCE,
    name: "Maintenance Visit",
    description: "General workshop maintenance inspection covering wear items, fluids, and seasonal readiness.",
  },
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { type: service.type },
      update: {
        name: service.name,
        description: service.description,
      },
      create: service,
    });
  }

  console.log(`Seeded ${services.length} services.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
