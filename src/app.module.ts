import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamodbModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        region: config.get<string>('DYNAMODB_REGION'),
        endpoint: config.get<string>('DYNAMODB_ENDPOINT'),
        credentials: {
          accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID', ''),
          secretAccessKey: config.get<string>('AWS_SECRET_KEY', ''),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
