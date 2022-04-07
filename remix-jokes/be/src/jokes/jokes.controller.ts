import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JokesService } from './jokes.service';
import { CreateJokeDto } from './dto/create-joke.dto';
import { UpdateJokeDto } from './dto/update-joke.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { GetUser } from 'src/users/get-user.decorator';

@ApiTags('jokes')
@Controller('jokes')
export class JokesController {
  constructor(private readonly jokesService: JokesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createJokeDto: CreateJokeDto, @GetUser() user) {
    return this.jokesService.create(createJokeDto, user.id);
  }

  @Get()
  findAll() {
    return this.jokesService.findAll();
  }

  @Get('/random')
  findRandom() {
    return this.jokesService.findRandom();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jokesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJokeDto: UpdateJokeDto) {
    return this.jokesService.update(+id, updateJokeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jokesService.remove(id);
  }
}
