import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { SlaMonitorService } from './sla-monitor.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], // ✅ This allows injection of UsersService
  controllers: [TicketsController],
  providers: [TicketsService, SlaMonitorService],
  exports: [TicketsService, SlaMonitorService],
})
export class TicketsModule {}
