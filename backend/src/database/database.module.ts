import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Quest, QuestSchema } from './schemas/quest.schema';
import {
  ExperimentLog,
  ExperimentLogSchema,
} from './schemas/experiment-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Quest.name, schema: QuestSchema },
      { name: ExperimentLog.name, schema: ExperimentLogSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
