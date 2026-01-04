import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FeedbackType } from '../../database/schemas/feedback.schema';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsEnum(FeedbackType)
  type!: FeedbackType;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsNotEmpty()
  @IsString()
  page_url!: string;
}