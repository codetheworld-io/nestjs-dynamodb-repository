import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository<T extends object> {
  protected abstract tableName: string;

  constructor(private readonly docClient: DynamoDBDocumentClient) {}

  async get(key: Partial<T>): Promise<T | null> {
    const { Item } = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      }),
    );

    return Item ? (Item as T) : null;
  }
}
