import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  Movie,
  MovieRepository,
} from '../dynamodb/repositories/movie.repository';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieRepository: MovieRepository) {}

  @Get('/:title/:year')
  async getMovie(
    @Param('title') title: string,
    @Param('year', ParseIntPipe) year: number,
  ): Promise<Movie> {
    const movie = await this.movieRepository.getByTitleAndYear(title, year);

    if (movie) {
      return movie;
    }

    throw new NotFoundException('Movie not found!');
  }
}
