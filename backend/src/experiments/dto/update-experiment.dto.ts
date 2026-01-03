import { PartialType } from '@nestjs/mapped-types';
import { CreateExperimentDto } from './create-experiment.dto';

export class UpdateExperimentDto extends PartialType(CreateExperimentDto) {
  logId!: string;
  observation?: string;
  resultData?: any;
  reflection?: string;
}
