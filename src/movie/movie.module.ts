import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';

@Module({
  controllers: [MovieController],
})
export class MovieModule {}
