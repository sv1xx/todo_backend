import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async findTodosByUser(userId: number) {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: { group: true },
    });
  }

  async getTodoById(userId: number, id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: { group: true },
    });

    if (!todo) {
      throw new NotFoundException('Задача не найдена');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой задаче');
    }

    return todo;
  }

  async createTodoForUser(userId: number, title: string, groupId?: number) {
    if (groupId) {
      await this.validateGroupOwnership(userId, groupId);
    }

    const maxOrder = await this.prisma.todo.aggregate({
      where: { userId },
      _max: { order: true },
    });

    const order = (maxOrder._max.order ?? 0) + 1;

    return this.prisma.todo.create({
      data: {
        title,
        userId,
        completed: false,
        order,
        groupId,
      },
      include: { group: true },
    });
  }

  async updateTodo(
    userId: number,
    todoId: number,
    data: {
      title?: string;
      completed?: boolean;
      order?: number;
      groupId?: number;
    },
  ) {
    await this.validateTodoOwnership(userId, todoId);

    if (data.groupId) {
      await this.validateGroupOwnership(userId, data.groupId);
    }

    return this.prisma.todo.update({
      where: { id: todoId },
      data,
      include: { group: true },
    });
  }

  async deleteTodo(userId: number, todoId: number) {
    await this.validateTodoOwnership(userId, todoId);

    return this.prisma.todo.delete({
      where: { id: todoId },
      include: { group: true },
    });
  }

  private async validateTodoOwnership(userId: number, todoId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new NotFoundException('Задача не найдена');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой задаче');
    }
  }

  private async validateGroupOwnership(userId: number, groupId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Группа не найдена');
    }

    if (group.ownerId !== userId) {
      throw new ForbiddenException('Нет доступа к этой группе');
    }
  }
}
