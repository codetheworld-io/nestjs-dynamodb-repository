import { DynamoDBRepository } from '../dynamodb.decorator';
import { BaseRepository } from './base.repository';

export interface Movie {
  year: number;
  title: string;
}

@DynamoDBRepository()
export class MovieRepository extends BaseRepository<Movie> {
  protected tableName = 'Movies';

  getByTitleAndYear(title: string, year: number): Promise<Movie | null> {
    return this.get({ title, year });
  }
}
