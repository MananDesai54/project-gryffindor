import { Injectable } from '@nestjs/common';

@Injectable()
export class InferenceService {
  generateText(text: string) {
    return text;
  }
}
