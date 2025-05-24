import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RcaService {
  constructor(private prisma: PrismaService) {}

  async submit(ticketId: number, userId: number, content: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket || ticket.status !== 'resolved') {
      throw new NotFoundException('Ticket not resolved or does not exist');
    }

    return this.prisma.rca.create({
      data: {
        content,
        submittedBy: userId,
        ticketId,
      },
    });
  }

  async getByTicket(ticketId: number) {
    return this.prisma.rca.findUnique({
      where: { ticketId },
    });
  }
}
