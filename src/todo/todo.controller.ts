import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../common/decorators/get-user.decorator';
import { TodoService } from './todo.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить все задачи пользователя',
    description:
      'Возвращает все задачи текущего аутентифицированного пользователя',
  })
  @ApiResponse({ status: 200, description: 'Список задач получен успешно' })
  getTodos(@User() user: any) {
    return this.todoService.findTodosByUser(user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить задачу по ID',
    description: 'Возвращает конкретную задачу по её идентификатору',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID задачи', example: 1 })
  @ApiResponse({ status: 200, description: 'Задача найдена' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  getTodoById(@User() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.todoService.getTodoById(user.userId, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать новую задачу',
    description: 'Создаёт новую задачу для текущего пользователя',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: {
          type: 'string',
          example: 'Купить хлеб',
          description: 'Название задачи',
        },
        groupId: {
          type: 'number',
          example: 1,
          nullable: true,
          description: 'ID группы, к которой относится задача',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Задача успешно создана' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  createTodo(
    @User() user: any,
    @Body('title') title: string,
    @Body('groupId') groupId?: number,
  ) {
    return this.todoService.createTodoForUser(user.userId, title, groupId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить задачу',
    description: 'Обновляет данные существующей задачи',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID задачи', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Обновлённый заголовок',
          description: 'Новое название задачи',
        },
        completed: {
          type: 'boolean',
          example: true,
          description: 'Статус выполнения задачи',
        },
        order: {
          type: 'number',
          example: 2,
          description: 'Порядковый номер задачи',
        },
        groupId: {
          type: 'number',
          example: 1,
          description: 'ID группы для перемещения задачи',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Задача обновлена' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  updateTodo(
    @User() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      title?: string;
      completed?: boolean;
      order?: number;
      groupId?: number;
    },
  ) {
    return this.todoService.updateTodo(user.userId, id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить задачу',
    description: 'Удаляет задачу по её идентификатору',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID задачи', example: 1 })
  @ApiResponse({ status: 200, description: 'Задача успешно удалена' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  deleteTodo(@User() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.todoService.deleteTodo(user.userId, id);
  }
}
