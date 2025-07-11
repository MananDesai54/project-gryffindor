import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CRUDService } from '../../core/rest/crud.controller';
import { RAGIndex } from './schema/ragIndex.schema';

@Injectable()
export class RAGIndexService implements CRUDService<RAGIndex> {
  constructor(
    @InjectModel(RAGIndex.name) private readonly ragIndexModel: Model<RAGIndex>,
  ) {}

  create(data: Partial<RAGIndex>): Promise<RAGIndex> {
    try {
      return this.ragIndexModel.create(data);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to create RAGIndex',
      );
    }
  }

  createMany(data: Partial<RAGIndex>[]): Promise<Partial<RAGIndex>[]> {
    try {
      return this.ragIndexModel.insertMany(data);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to create RAGIndex',
      );
    }
  }

  read(id: string) {
    try {
      return this.ragIndexModel.findById(id) as Promise<RAGIndex>;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Failed to read RAGIndex');
    }
  }

  delete(id: string) {
    try {
      return this.ragIndexModel.findByIdAndDelete(id) as Promise<RAGIndex>;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to delete RAGIndex',
      );
    }
  }

  update(id: string, data: Partial<RAGIndex>) {
    try {
      return this.ragIndexModel.findByIdAndUpdate(id, data, {
        new: true,
      }) as Promise<RAGIndex>;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to update RAGIndex',
      );
    }
  }
}
