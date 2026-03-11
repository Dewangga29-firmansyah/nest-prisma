import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')
export class BookController {
  constructor(private readonly booksService: BookService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Get('title/:title')
  @ApiOperation({ summary: 'Find a book by title' })
  findByTitle(@Param('title') title: string) {
    return this.booksService.findByTitle(title);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a book by ID' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Find all books' })
  findAll() {
    return this.booksService.findAll();
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(Number(id));
  }
}
