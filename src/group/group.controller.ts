import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { createGroupSchema } from './dto/create-group.dto';
import { updateGroupSchema } from './dto/update-group.dto';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить все группы текущего пользователя',
    description:
      'Возвращает все группы, принадлежащие аутентифицированному пользователю',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Ошибка, если неверный токен',
  })
  getAll(@CurrentUserId() userId: number) {
    return this.groupService.getAll(userId);
  }

  @Get(':id/todos')
  @ApiOperation({
    summary: 'Получить задачи по группе',
    description: 'Возвращает все задачи, принадлежащие указанной группе',
  })
  @ApiParam({
    name: 'id',
    description: 'ID группы',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Группа не найдена или не принадлежит пользователю',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Ошибка, если неверный токен',
  })
  getTodosByGroup(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId: number,
  ) {
    return this.groupService.getTodos(id, userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать новую группу',
    description:
      'Создает новую группу задач для аутентифицированного пользователя',
  })
  @ApiBody({
    description: 'Данные для создания группы',
    schema: {
      example: {
        name: 'Рабочие задачи',
        color: '#FF5733',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные входные данные',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Ошибка, если неверный токен',
  })
  create(
    @CurrentUserId() userId: number,
    @ZodBody(createGroupSchema) body: any,
  ) {
    return this.groupService.create(userId, body);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить группу',
    description: 'Обновляет существующую группу, принадлежащую пользователю',
  })
  @ApiParam({
    name: 'id',
    description: 'ID группы для обновления',
    type: Number,
    example: 1,
  })
  @ApiBody({
    description: 'Данные для обновления группы',
    schema: {
      example: {
        name: 'Обновленное название группы',
        color: '#33FF57',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Группа не найдена или не принадлежит пользователю',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные входные данные',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Ошибка, если неверный токен',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId: number,
    @ZodBody(updateGroupSchema) body: any,
  ) {
    return this.groupService.update(id, userId, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить группу',
    description: 'Удаляет группу, принадлежащую пользователю',
  })
  @ApiParam({
    name: 'id',
    description: 'ID группы для удаления',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Группа успешно удалена',
    schema: {
      example: {
        message: 'Группа успешно удалена',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Группа не найдена или не принадлежит пользователю',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Ошибка, если неверный токен',
  })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId: number,
  ) {
    return this.groupService.delete(id, userId);
  }
}
