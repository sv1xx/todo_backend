import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const AutoDto = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export class AuthDtoType {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль (мин. 6 символов)',
  })
  password: string;
}
