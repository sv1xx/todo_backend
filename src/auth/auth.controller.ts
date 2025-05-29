import { Controller, Post, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoType, AutoDto } from './dto/auth.dto';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth/Register')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Регистрация пользователя',
    description: 'Создает нового пользователя в системе',
  })
  @ApiBody({
    description: 'Данные для регистрации',
    type: AuthDtoType,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'strongPassword123',
        },
        summary: 'Пример запроса на регистрацию',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Пользователь успешно зарегистрирован',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Невалидные данные',
    schema: {
      example: {
        statusCode: 400,
        message: ['email должен быть email', 'password должен быть строкой'],
        error: 'Bad Request',
      },
    },
  })
  async register(@ZodBody(AutoDto) body: AuthDtoType) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Авторизация пользователя',
    description: 'Вход в систему с получением JWT токена',
  })
  @ApiBody({
    description: 'Данные для авторизации',
    type: AuthDtoType,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'strongPassword123',
        },
        summary: 'Пример запроса на авторизацию',
      },
    },
  })
  @ApiOkResponse({
    description: 'Успешная авторизация',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expires_in: 3600,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Неверные учетные данные',
    schema: {
      example: {
        statusCode: 401,
        message: 'Неверный email или пароль',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Невалидные данные',
    schema: {
      example: {
        statusCode: 400,
        message: ['email должен быть email', 'password должен быть строкой'],
        error: 'Bad Request',
      },
    },
  })
  async login(@ZodBody(AutoDto) body: AuthDtoType) {
    return this.authService.login(body.email, body.password);
  }
}
