import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Ticket } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  create(data: Pick<Ticket, 'title' | 'description' | 'createdBy'>) {
    return this.prisma.ticket.create({
      data,
    });
  }

  findAll() {
    return this.prisma.ticket.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  findById(id: number) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}
