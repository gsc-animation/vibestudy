import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import OpenAI from 'openai';

// Mock the OpenAI class
jest.mock('openai', () => {
  return class OpenAI {
    apiKey = 'sk-test-key';
    chat = {
      completions: {
        create: jest.fn(),
      },
    };
    constructor(config: any) {
        if (config?.apiKey) {
            this.apiKey = config.apiKey;
        }
    }
  };
});

describe('AiService', () => {
  let service: AiService;
  let configService: ConfigService;
  let openaiMock: any;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'OPENAI_API_KEY') {
                return 'sk-test-key';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    configService = module.get<ConfigService>(ConfigService);
    // Get the mocked instance
    openaiMock = (service as any).openai;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateText', () => {
    it('should call OpenAI API and return content', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Generated text',
            },
          },
        ],
      };

      openaiMock.chat.completions.create.mockResolvedValue(mockResponse);

      const prompt = 'Test prompt';
      const result = await service.generateText(prompt);

      expect(openaiMock.chat.completions.create).toHaveBeenCalledWith({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
      expect(result).toBe('Generated text');
    });

    it('should return mock response if API key is mock key', async () => {
        // Re-create service with mock key
        const module: TestingModule = await Test.createTestingModule({
            providers: [
              AiService,
              {
                provide: ConfigService,
                useValue: {
                  get: jest.fn().mockReturnValue(null), // Will default to 'sk-mock-key' in constructor
                },
              },
            ],
          }).compile();
          
        const mockService = module.get<AiService>(AiService);
        // Force the key to be the mock key (as the constructor logic does)
        (mockService as any).openai.apiKey = 'sk-mock-key';

        const prompt = 'Test prompt';
        const result = await mockService.generateText(prompt);

        expect(result).toContain('[Mock AI Response]');
        expect(result).toContain(prompt);
    });
  });

  describe('generateParentInsight', () => {
    it('should return insights', async () => {
      const parentId = 'parent123';
      const childId = 'child123';
      
      // Mock generateText to return a standard response
      jest.spyOn(service, 'generateText').mockResolvedValue('AI generated insight');

      const result = await service.generateParentInsight(parentId, childId);

      expect(result.childId).toBe(childId);
      expect(result.weeklyInsight).toBe('AI generated insight');
      expect(result.statistics).toBeDefined();
      expect(result.recommendations).toHaveLength(3);
    });

    it('should fallback to mock insight on error', async () => {
       jest.spyOn(service, 'generateText').mockRejectedValue(new Error('API Error'));

       const result = await service.generateParentInsight('p1', 'c1');

       expect(result.weeklyInsight).toContain('Great news!');
       expect(result.statistics).toBeDefined();
    });
  });
});