import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { RcaModule } from './rca/rca.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    TicketsModule,
    RcaModule,
  ],
})
export class AppModule {}

