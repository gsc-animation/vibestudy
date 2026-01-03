import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { ExperimentLog, ExperimentLogDocument } from '../database/schemas/experiment-log.schema';

@Injectable()
export class ExperimentsService {
  constructor(
    @InjectModel(ExperimentLog.name) private experimentLogModel: Model<ExperimentLogDocument>,
  ) {}

  async createLog(createExperimentDto: CreateExperimentDto): Promise<ExperimentLogDocument> {
    const { userId, questId, prediction } = createExperimentDto;
    const newLog = new this.experimentLogModel({
      user_id: userId,
      quest_id: questId,
      prediction_text: prediction,
    });
    return newLog.save();
  }

  async updateResult(updateExperimentDto: UpdateExperimentDto): Promise<ExperimentLogDocument> {
    const { logId, observation, resultData, reflection } = updateExperimentDto;
    
    const updateFields: Record<string, unknown> = {};
    
    if (observation !== undefined) {
      updateFields.observation_text = observation;
    }
    if (resultData !== undefined) {
      updateFields.result_data = resultData;
    }
    if (reflection !== undefined) {
      updateFields.reflection_text = reflection;
    }
    
    const updatedLog = await this.experimentLogModel.findByIdAndUpdate(
      logId,
      updateFields,
      { new: true }
    ).exec();

    if (!updatedLog) {
      throw new NotFoundException(`Experiment log with ID ${logId} not found`);
    }

    return updatedLog;
  }
}
