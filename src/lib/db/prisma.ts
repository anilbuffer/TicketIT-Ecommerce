// src/lib/db/prisma.ts
// Prisma client singleton for production adapter cutover (Phase 2+)

declare const __non_webpack_require__: any;

// Fallback proxy to allow compilation and running in mock data mode without @prisma/client installed
function createPrismaFallback() {
  return new Proxy({}, {
    get(_, prop) {
      return () => {
        throw new Error(
          `Prisma client is not available or generated. Set up DATABASE_URL and install @prisma/client to use production database mode. Attempted to call '${String(prop)}'`
        );
      };
    }
  });
}

let prismaInstance: any = null;

export function getPrismaClient() {
  if (!prismaInstance) {
    try {
      // Dynamic require so webpack does not fail during compilation when @prisma/client is not present
      const req = typeof __non_webpack_require__ !== 'undefined'
        ? __non_webpack_require__
        : (typeof require !== 'undefined' ? eval('require') : null);
      if (req) {
        const { PrismaClient } = req('@prisma/client');
        prismaInstance = new PrismaClient();
      } else {
        prismaInstance = createPrismaFallback();
      }
    } catch {
      prismaInstance = createPrismaFallback();
    }
  }
  return prismaInstance;
}

export const prisma = getPrismaClient();
export default prisma;

