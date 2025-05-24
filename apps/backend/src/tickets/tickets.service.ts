import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { addHours } from 'date-fns';
import { AIAgentRouter } from '../ai-agent/agent.router';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService
  ) {}

  private getSlaDeadline(priority: string): Date {
    const now = new Date();
    if (priority === 'high') return addHours(now, 24);
    if (priority === 'medium') return addHours(now, 72);
    return addHours(now, 120);
  }

  async create(data: { title: string; description: string; createdBy: number; priority?: string }) {
  const priority = data.priority ?? 'medium';
  const slaDueAt = this.getSlaDeadline(priority);

  const ticket = await this.prisma.ticket.create({
    data: {
      ...data,
      priority,
      slaDueAt,
    },
  });

  // 🧠 AI DOMAIN ROUTING + AUTO ASSIGNMENT
  const domain = AIAgentRouter.suggestExpertDomainFromTitle(ticket.title);

  const expert = await this.usersService.findAvailableExpertByDomain(domain);
  if (expert) {
    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        assignedTo: expert.id,
        status: 'in_progress',
      },
      include: {
        assignee: true,
        creator: true,
      },
    });
  }

  return ticket; // return unassigned if no match
}


  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        creator: { select: { id: true, email: true, role: true } },
        assignee: { select: { id: true, email: true, role: true } },
        escalator: { select: { id: true, email: true, role: true } },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: true,
        assignee: true,
        escalator: true,
      },
    });
  }

  async updateStatus(id: number, data: { status: string }) {
    return this.prisma.ticket.update({
      where: { id },
      data,
    });
  }

  async escalateTicket(id: number, escalatedBy: number) {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        status: 'escalated',
        escalated: true,
        escalatedAt: new Date(),
        escalatedBy,
        escalationReason: 'Manual escalation',
      },
    });
  }

  async assignTicket(id: number, expertId: number) {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        assignedTo: expertId,
        status: 'in_progress',
      },
    });
  }

  async autoAssignTicket(id: number, domain: string) {
    const expert = await this.usersService.findAvailableExpertByDomain(domain);
    if (!expert) throw new Error('No expert available');

    return this.prisma.ticket.update({
      where: { id },
      data: {
        assignedTo: expert.id,
        status: 'in_progress',
      },
    });
  }
  async getClientTickets(userId: number) {
  return this.prisma.ticket.findMany({
    where: { createdBy: userId },
  });
}

async getExpertTickets(userId: number) {
  return this.prisma.ticket.findMany({
    where: { assignedTo: userId },
    include: {
      creator: {
        select: { id: true, email: true },
      },
      escalator: {
        select: { id: true, email: true },
      },
      Rca: true,
    },
    orderBy: {
      priority: 'asc',
    },
  });
}

async getEscalatedTickets() {
  return this.prisma.ticket.findMany({
    where: { escalated: true },
  });
}

async getUnassignedTickets() {
  return this.prisma.ticket.findMany({
    where: { assignedTo: null },
  });
}

async getTicketsMissingRca() {
  return this.prisma.ticket.findMany({
    where: {
      status: 'resolved',
      Rca: null,
    },
    include: {
      Rca: true,
    },
  });
}

}
