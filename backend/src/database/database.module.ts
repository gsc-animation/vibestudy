import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Quest, QuestSchema } from './schemas/quest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Quest.name, schema: QuestSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}