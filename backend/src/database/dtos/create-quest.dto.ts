import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateQuestSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  status: z.enum(['Backlog', 'Todo', 'Doing', 'Done']),
  difficulty: z.string(),
  subject_tag: z.string(),
  sprint_week: z.number().int().min(1),
});

export class CreateQuestDto extends createZodDto(CreateQuestSchema) {}
