import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GroupService {
  [x: string]: any;
  constructor(private readonly prisma: PrismaService) {}

  getAll(userId: number) {
    return this.prisma.group.findMany({
      where: { ownerId: userId },
    });
  }

  getTodos(groupId: number, userId: number) {
    return this.prisma.todo.findMany({
      where: {
        groupId,
        userId: userId,
      },
    });
  }

  create(userId: number, data: { name: string }) {
    return this.prisma.group.create({
      data: {
        name: data.name,
        owner: {
          connect: { id: userId },
        },
      },
    });
  }

  async update(id: number, userId: number, data: { name?: string }) {
    const existing = await this.prisma.group.findFirst({
      where: { id, ownerId: userId },
    });

    if (!existing) throw new NotFoundException('Группа не найдена');

    return this.prisma.group.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    const existing = await this.prisma.group.findFirst({
      where: { id, ownerId: userId },
    });

    if (!existing) throw new NotFoundException('Группа не найдена');

    return this.prisma.group.delete({ where: { id } });
  }
}
