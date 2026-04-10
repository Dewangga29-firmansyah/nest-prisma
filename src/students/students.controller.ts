import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';
import { Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all students' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('my-history')
  @ApiOperation({ summary: 'Retrieve my exam history' })
  getMyHistory(@Req() req) {
    return this.studentsService.getMyHistory(req.user.studentId);
  }

  @Get('nis/:nis')
  @ApiOperation({ summary: 'Find a student by NIS' })
  findByNis(@Param('nis') nis: string) {
    return this.studentsService.findByNis(nis);
  }

  @Get('search/name/:name')
  @ApiOperation({ summary: 'Filter students by name' })
  filterByName(@Param('name') name: string) {
    return this.studentsService.filterByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a student by ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }
}