import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    public connected = false;

    async onModuleInit() {
        try {
            await this.$connect();
            this.connected = true;
            // eslint-disable-next-line no-console
            console.log('Prisma: connected to database');
        } catch (err) {
            // Don't crash the whole app on DB connect failure — log a helpful message.
            // This lets the HTTP server start so the developer can inspect logs and
            // fix DB issues without losing access to health endpoints.
            // eslint-disable-next-line no-console
            console.error('Prisma: could not connect to database:', err?.message ?? err);
            this.connected = false;
        }
    }

}
