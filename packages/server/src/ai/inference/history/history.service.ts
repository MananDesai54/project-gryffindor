import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { MongoDBChatMessageHistory } from '@langchain/mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Collection, Document } from 'mongodb';
import { Model } from 'mongoose';
import { ChatMessageHistory } from './schema/history.schema';

@Injectable()
export class HistoryService {
  private collection: Collection<Document>;

  constructor(
    @InjectModel(ChatMessageHistory.name)
    private readonly historyModel: Model<ChatMessageHistory>,
  ) {
    this.collection = this.historyModel.collection;
  }

  private getHistoryManager(sessionId: string): MongoDBChatMessageHistory {
    return new MongoDBChatMessageHistory({
      collection: this.collection,
      sessionId,
    });
  }

  async getHistory(sessionId: string): Promise<BaseMessage[]> {
    const historyManager = this.getHistoryManager(sessionId);
    return historyManager.getMessages();
  }

  async addTurn(
    sessionId: string,
    humanMessage: string,
    aiMessage: string,
  ): Promise<void> {
    const historyManager = this.getHistoryManager(sessionId);
    await historyManager.addMessages([
      new HumanMessage(humanMessage),
      new AIMessage(aiMessage),
    ]);
  }
}
