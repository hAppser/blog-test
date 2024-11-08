import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongooseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri:
    configService.get<string>('MONGO_URL') || 'mongodb://localhost:27017/blog',
});
