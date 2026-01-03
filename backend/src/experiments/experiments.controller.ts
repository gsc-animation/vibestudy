import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';

@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) {}

  @Post('predict')
  async create(@Body() createExperimentDto: CreateExperimentDto) {
    const log = await this.experimentsService.createLog(createExperimentDto);
    return { logId: log._id };
  }

  @Post('result')
  async updateResult(@Body() updateExperimentDto: UpdateExperimentDto) {
    return this.experimentsService.updateResult(updateExperimentDto);
  }
}
