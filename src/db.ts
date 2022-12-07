import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { isProd, ONE_WEEK } from './const';

export const prisma = new PrismaClient();

export const prismaSessionStore = new PrismaSessionStore(prisma, {
    /* istanbul ignore next */
    checkPeriod: isProd ? ONE_WEEK : undefined,
});
