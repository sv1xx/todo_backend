import {
  createParamDecorator,
  ExecutionContext,
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.errors);
      }
      throw error;
    }
  }
}

export function ZodBody(schema: ZodSchema<any>) {
  // Это — функция, возвращающая параметр-декоратор
  return createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const pipe = new ZodValidationPipe(schema);
    // Прогоняем тело запроса через пайп валидации
    return pipe.transform(request.body);
  })();
}
