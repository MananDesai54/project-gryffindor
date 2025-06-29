import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AiTool } from '../schema/aiTool.schema';
import { Model } from 'mongoose';

@Injectable()
export class AiToolService {
  constructor(
    @InjectModel(AiTool.name) private readonly aiToolService: Model<AiTool>,
  ) {}
}
