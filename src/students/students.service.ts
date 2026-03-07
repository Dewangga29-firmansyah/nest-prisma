import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const student = await this.prisma.student.create({ data: dto });

    const password = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        username: dto.nis,
        password: hash,
        role: UserRole.STUDENT,
        studentId: student.id,
      },
    });

    return { student, password };
  }

  async getMyHistory(studentId: number) {
    return this.prisma.peminjaman.findMany({
      where: { studentId },
    });
  }

  async findAll() {
    return this.prisma.student.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async findByNis(nis: string) {
    const student = await this.prisma.student.findUnique({
      where: { nis },
    });

    if (!student) {
      throw new NotFoundException(`Student dengan NIS ${nis} tidak ditemukan`);
    }

    return student;
  }

  async filterByName(name: string) {
    return this.prisma.student.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  async update(id: number, dto: UpdateStudentDto) {
    // pastikan ada dulu
    await this.findOne(id);
    return this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    // pastikan ada dulu
    await this.findOne(id);
    return this.prisma.student.delete({ where: { id } });
  }
}
