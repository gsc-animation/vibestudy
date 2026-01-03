import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExperimentLogDocument = ExperimentLog & Document;

@Schema()
export class ExperimentLog {
  @Prop({ required: true })
  user_id!: string;

  @Prop({ required: true })
  quest_id!: string;

  @Prop({ required: true })
  prediction_text!: string;

  @Prop()
  observation_text?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  result_data: any;

  @Prop()
  reflection_text?: string;

  @Prop({ default: Date.now })
  timestamp!: Date;
}

export const ExperimentLogSchema = SchemaFactory.createForClass(ExperimentLog);
