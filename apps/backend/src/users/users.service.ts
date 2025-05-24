import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
  async findAvailableExpertByDomain(domain: string) {
  return this.prisma.user.findFirst({
    where: {
      role: 'expert',
      isAvailable: true,
      expertise: domain,
    },
    orderBy: {
      createdAt: 'asc', // or assigned ticket count if tracked
    },
  });
}

}
