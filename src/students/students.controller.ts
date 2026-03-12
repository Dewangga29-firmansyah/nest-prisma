import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any;
}

import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { LoginStudentDto } from './dto/login-student.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UserRole } from '@prisma/client';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // GET ALL STUDENTS
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  // HISTORY PEMINJAMAN STUDENT SENDIRI
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get('my-history')
  getMyHistory(@Req() req: AuthenticatedRequest) {
    const user = req.user as any;
    return this.studentsService.getMyHistory(user.studentId);
  }

  // FIND STUDENT BY NIS
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get('nis/:nis')
  findByNis(@Param('nis') nis: string) {
    return this.studentsService.findByNis(nis);
  }

  // SEARCH STUDENT BY NAME
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get('search/name/:name')
  filterByName(@Param('name') name: string) {
    return this.studentsService.filterByName(name);
  }

  // FIND STUDENT BY ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }

  // UPDATE STUDENT
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto, @Req() req) {
    const user = req.user as any;

    if (user.role === UserRole.PETUGAS) {
      throw new ForbiddenException('Petugas tidak bisa mengedit student');
    }

    return this.studentsService.update(Number(id), dto);
  }

  // DELETE STUDENT (ADMIN ONLY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }

  // LOGIN STUDENT
  @Post('login')
  login(@Body() dto: LoginStudentDto) {
    return this.studentsService.login(dto);
  }
}