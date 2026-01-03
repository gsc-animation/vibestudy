import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('parent-insight')
  async getParentInsight(
    @Query('userId') userId: string,
    @Query('childId') childId: string,
  ) {
    return this.aiService.generateParentInsight(userId, childId);
  }
}
