import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<DynamoDBClientConfig>()
    .setExtras({ isGlobal: true }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .setClassMethodName('forRoot')
    .build();
