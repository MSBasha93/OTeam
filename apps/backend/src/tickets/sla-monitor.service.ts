import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlaMonitorService {
  private readonly logger = new Logger(SlaMonitorService.name);

  constructor(private prisma: PrismaService) {}

  async escalateOverdueTickets() {
    const now = new Date();

    const overdue = await this.prisma.ticket.findMany({
      where: {
        slaDueAt: { lt: now },
        escalated: false,
        status: { not: 'resolved' },
      },
    });

    for (const ticket of overdue) {
      await this.prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          escalated: true,
          status: 'escalated',
          escalatedAt: now,
          escalationReason: 'SLA violation',
        },
      });

      this.logger.log(`Auto-escalated ticket #${ticket.id} due to SLA`);
    }
  }
}
