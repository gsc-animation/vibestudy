import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestDocument = Quest & Document;

@Schema()
export class Quest {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, enum: ['Backlog', 'Todo', 'Doing', 'Done'] })
  status!: string;

  @Prop({ required: true })
  difficulty!: string;

  @Prop({ required: true })
  subject_tag!: string;

  @Prop({ required: true })
  sprint_week!: number;
}

export const QuestSchema = SchemaFactory.createForClass(Quest);
