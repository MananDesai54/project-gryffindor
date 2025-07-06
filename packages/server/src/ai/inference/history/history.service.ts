import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  mapChatMessagesToStoredMessages,
  mapStoredMessagesToChatMessages,
  StoredMessage,
} from '@langchain/core/messages';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessageHistory } from './schema/history.schema';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(ChatMessageHistory.name)
    private readonly historyModel: Model<ChatMessageHistory>,
  ) {}

  async getHistoryForAgent(sessionId: string): Promise<BaseMessage[]> {
    try {
      const history = await this.historyModel.findOne({ sessionId });
      if (!history) {
        return [];
      }
      return mapStoredMessagesToChatMessages(
        history.messages as StoredMessage[],
      );
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error getting history:');
    }
  }

  async getHistoryForUser(sessionId: string) {
    try {
      const history = await this.historyModel.findOne({ sessionId });
      if (!history) {
        return [];
      }
      return history.messages as StoredMessage[];
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error getting history:');
    }
  }

  async clearHistory(sessionId: string) {
    try {
      const history = await this.historyModel.findOneAndDelete({ sessionId });
      if (!history) {
        throw new NotFoundException('History not found');
      }
      return history;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error clearing history:');
    }
  }

  async addTurn(sessionId: string, humanMessage: string, aiMessage: string) {
    try {
      const messages = mapChatMessagesToStoredMessages([
        new HumanMessage(humanMessage),
        new AIMessage(aiMessage),
      ]);
      await this.historyModel.updateOne(
        { sessionId },
        {
          $push: { messages: { $each: messages } },
        },
        { upsert: true },
      );
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error adding turn:');
    }
  }
}
