import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password_hash: z.string().min(6),
  role: z.enum(['parent', 'student']),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
