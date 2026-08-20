// src/lib/db/prisma.ts
// Prisma client singleton for production adapter cutover (Phase 2+)

// Note: @prisma/client will be used once installed and generated for production
let prismaInstance: any = null;

export function getPrismaClient() {
  if (!prismaInstance) {
    try {
      // Dynamic require so mock mode works seamlessly without generated Prisma client
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PrismaClient } = require('@prisma/client');
      prismaInstance = new PrismaClient();
    } catch {
      // Mock / fallback proxy if Prisma is not generated yet
      prismaInstance = new Proxy({}, {
        get(_, prop) {
          return () => {
            throw new Error(
              `Prisma client has not been generated yet. Run 'npx prisma generate' and configure DATABASE_URL. Attempted to access '${String(prop)}'`
            );
          };
        }
      });
    }
  }
  return prismaInstance;
}

export const prisma = getPrismaClient();
export default prisma;
