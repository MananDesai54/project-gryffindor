import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_CONNECTION_URI,
        autoIndex: true,
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),
  ],
})
export class MongoModule {}
