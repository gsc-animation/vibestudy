import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ParentInsightResponse,
  ParentInsightStatistics,
} from './dto/parent-insight.dto';

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

  async generateText(
    prompt: string,
    model: string = 'gpt-3.5-turbo',
  ): Promise<string> {
    try {
      // If using the mock key, return a mock response to avoid API errors
      if (this.openai.apiKey === 'sk-mock-key') {
        this.logger.warn(
          'OPENAI_API_KEY not set or using mock key. Returning mock response.',
        );
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

  async generateParentInsight(
    parentId: string,
    childId: string,
  ): Promise<ParentInsightResponse> {
    // Mock data aggregation (in production, query from MongoDB)
    const mockData: ParentInsightStatistics = {
      totalExperiments: 12,
      successRate: 75,
      favoriteTopics: ['Magnetism', 'Forces'],
      recentActivity: 'Completed 3 magnet experiments this week',
      predictionsAccuracy: 60,
      areasForImprovement: ['Making detailed observations'],
      strengths: ['Creative predictions', 'Persistence'],
    };

    // Generate insight using AI or return mock
    const prompt = `As an educational AI, generate a brief, encouraging weekly insight for a parent about their child's science learning. Data: ${JSON.stringify(mockData)}`;

    let aiResponse: string;
    try {
      aiResponse = await this.generateText(prompt);
      // If we got a mock response, use our custom mock instead
      if (aiResponse.startsWith('[Mock AI Response]')) {
        aiResponse = this.getMockParentInsight(mockData);
      }
    } catch {
      aiResponse = this.getMockParentInsight(mockData);
    }

    return {
      childId,
      generatedAt: new Date().toISOString(),
      weeklyInsight: aiResponse,
      statistics: mockData,
      recommendations: [
        'Ask your child to explain what happens when magnets get close',
        'Encourage them to draw pictures of magnetic field lines',
        'Try a hands-on experiment with household magnets',
      ],
    };
  }

  private getMockParentInsight(data: ParentInsightStatistics): string {
    return `Great news! Your child has been actively exploring science this week, completing ${data.totalExperiments} experiments with a ${data.successRate}% success rate. They show particular interest in ${data.favoriteTopics.join(' and ')}. Their creative approach to making predictions is a real strength! To support their learning, try asking them to explain their discoveries to you - teaching others is one of the best ways to deepen understanding.`;
  }
}
