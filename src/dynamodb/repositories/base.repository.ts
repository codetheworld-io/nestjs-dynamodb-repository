import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

type ArrayElement<T> = T extends Array<infer R> ? R : never;

type QueryInput<TModel, TModelKey = keyof TModel> = Omit<
  QueryCommandInput,
  'TableName' | 'ProjectionExpression' | 'ExpressionAttributeNames'
> & {
  ProjectionExpression?: Array<TModelKey>;
  ExpressionAttributeNames?: Partial<
    Record<`#${TModelKey & string}`, TModelKey & string>
  >;
};

type QueryOutput<TModel, TParams> = TParams extends {
  ProjectionExpression: infer TProjection;
}
  ? TProjection extends Array<keyof TModel>
    ? Array<Pick<TModel, Extract<ArrayElement<TProjection>, keyof TModel>>>
    : never
  : TModel[];

@Injectable()
export abstract class BaseRepository<T> {
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

  async query<TParams extends QueryInput<T>>(
    params: TParams,
  ): Promise<QueryOutput<T, TParams>> {
    const result: any[] = [];

    const queryParams: QueryCommandInput = {
      ...params,
      TableName: this.tableName,
      ExpressionAttributeNames: params.ExpressionAttributeNames as Record<
        string,
        string
      >,
      ProjectionExpression: undefined,
    };

    if (params.ProjectionExpression) {
      queryParams.ProjectionExpression = params.ProjectionExpression.map(
        (p) => `#${String(p)}`,
      ).join(',');
      queryParams.ExpressionAttributeNames = {
        ...params.ProjectionExpression.reduce((acc, p) => {
          acc[`#${String(p)}`] = String(p);
          return acc;
        }, {} as Record<string, string>),
        ...(queryParams.ExpressionAttributeNames ?? {}),
      };
    }

    do {
      const { Items, LastEvaluatedKey } = await this.docClient.send(
        new QueryCommand(queryParams),
      );
      if (Items) {
        result.push(...Items);
      }

      queryParams.ExclusiveStartKey = LastEvaluatedKey;
    } while (queryParams.ExclusiveStartKey);

    return result as QueryOutput<T, TParams>;
  }
}
