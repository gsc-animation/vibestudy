import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ExperimentsService } from './experiments.service';
import { ExperimentLog } from '../database/schemas/experiment-log.schema';
import { NotFoundException } from '@nestjs/common';

describe('ExperimentsService', () => {
  let service: ExperimentsService;
  let mockModel: any;

  // Define a mock instance with save method
  const mockExperimentLogInstance = {
    save: jest.fn(),
  };

  // Define the mock model constructor and static methods
  class MockModel {
    constructor(private data: any) {
      Object.assign(this, data);
    }
    save = mockExperimentLogInstance.save;
    static findByIdAndUpdate = jest.fn();
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentsService,
        {
          provide: getModelToken(ExperimentLog.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<ExperimentsService>(ExperimentsService);
    mockModel = module.get(getModelToken(ExperimentLog.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLog', () => {
    it('should create and save a new experiment log', async () => {
      const createDto = {
        userId: 'user123',
        questId: 'quest123',
        prediction: 'It will float',
      };

      const expectedSavedLog = {
        user_id: createDto.userId,
        quest_id: createDto.questId,
        prediction_text: createDto.prediction,
      };

      mockExperimentLogInstance.save.mockResolvedValue(expectedSavedLog);

      const result = await service.createLog(createDto);

      expect(mockExperimentLogInstance.save).toHaveBeenCalled();
      expect(result).toEqual(expectedSavedLog);
    });
  });

  describe('updateResult', () => {
    it('should update an existing log', async () => {
      const updateDto = {
        logId: 'log123',
        observation: 'It floated',
        resultData: { float: true },
        reflection: 'I was right',
      };

      const expectedUpdatedLog = {
        _id: 'log123',
        observation_text: updateDto.observation,
        result_data: updateDto.resultData,
        reflection_text: updateDto.reflection,
      };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(expectedUpdatedLog),
      });

      const result = await service.updateResult(updateDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        updateDto.logId,
        {
          observation_text: updateDto.observation,
          result_data: updateDto.resultData,
          reflection_text: updateDto.reflection,
        },
        { new: true },
      );
      expect(result).toEqual(expectedUpdatedLog);
    });

    it('should throw NotFoundException if log not found', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateResult({ logId: 'nonexistent' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});