import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { Quest, QuestDocument } from '../database/schemas/quest.schema';

@Injectable()
export class QuestsService {
  constructor(@InjectModel(Quest.name) private questModel: Model<QuestDocument>) {}

  async create(createQuestDto: CreateQuestDto): Promise<Quest> {
    const createdQuest = new this.questModel(createQuestDto);
    return createdQuest.save();
  }

  async findAll(): Promise<Quest[]> {
    return this.questModel.find().exec();
  }

  async findOne(id: string): Promise<Quest> {
    const quest = await this.questModel.findById(id).exec();
    if (!quest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }
    return quest;
  }

  async update(id: string, updateQuestDto: UpdateQuestDto): Promise<Quest> {
    const updatedQuest = await this.questModel
      .findByIdAndUpdate(id, updateQuestDto, { new: true })
      .exec();
    
    if (!updatedQuest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }
    
    return updatedQuest;
  }

  async updateStatus(id: string, status: string): Promise<Quest> {
    const updatedQuest = await this.questModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!updatedQuest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }

    return updatedQuest;
  }

  async remove(id: string): Promise<Quest> {
    const deletedQuest = await this.questModel.findByIdAndDelete(id).exec();
    
    if (!deletedQuest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }
    
    return deletedQuest;
  }
}
