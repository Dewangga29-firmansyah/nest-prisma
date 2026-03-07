import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('peminjaman')
export class PeminjamanController {
  constructor(private readonly peminjamanService: PeminjamanService) {}

  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @UseGuards(JwtAuthGuard, RolesGuard)

  // GET /peminjaman
  @Get()
  findAll() {
    return this.peminjamanService.findAll();
  }

  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.peminjamanService.findByDate(date);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.peminjamanService.findById(+id);
  }

  // POST /peminjaman
  @Post()
  create(@Body() dto: CreatePeminjamanDto) {
    return this.peminjamanService.create(dto);
  }
}
