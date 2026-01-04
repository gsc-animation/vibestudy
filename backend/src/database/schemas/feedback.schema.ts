import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

export enum FeedbackType {
  BUG = 'bug',
  FEATURE = 'feature',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true })
  content!: string;

  @Prop({ required: true, enum: FeedbackType })
  type!: FeedbackType;

  @Prop({ required: false })
  user_id?: string;

  @Prop({ required: true })
  page_url!: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);