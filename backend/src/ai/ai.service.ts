import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    this.openai = new OpenAI({
      apiKey: apiKey || 'sk-mock-key',
    });
  }

  async generateText(prompt: string, model: string = 'gpt-3.5-turbo'): Promise<string> {
    try {
      // If using the mock key, return a mock response to avoid API errors
      if (this.openai.apiKey === 'sk-mock-key') {
         this.logger.warn('OPENAI_API_KEY not set or using mock key. Returning mock response.');
         return `[Mock AI Response] You asked: ${prompt}`;
      }

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: model,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      this.logger.error('Error generating text from OpenAI', error);
      throw error;
    }
  }
}