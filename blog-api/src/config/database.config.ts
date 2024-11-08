import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService) => ({
  uri:
    configService.get<string>('MONGO_URL') || 'mongodb://localhost:27017/blog',
});
