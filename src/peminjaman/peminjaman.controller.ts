import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags ('Peminjaman')
@Controller('peminjaman')
export class PeminjamanController {
  constructor(private readonly peminjamanService: PeminjamanService) {}

  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @UseGuards(JwtAuthGuard, RolesGuard)

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get()
  @ApiOperation({ summary: 'Get all peminjaman records' })
  findAll() {
    return this.peminjamanService.findAll();
  }

  @Get('date/:date')
    @ApiOperation({ summary: 'Find peminjaman records by date' })
  findByDate(@Param('date') date: string) {
    return this.peminjamanService.findByDate(date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a peminjaman record by ID' })
  findById(@Param('id') id: string) {
    return this.peminjamanService.findById(+id);
  }

  // POST /peminjaman
  @Post()
  @ApiOperation({ summary: 'Create a new peminjaman record' })
  create(@Body() dto: CreatePeminjamanDto) {
    return this.peminjamanService.create(dto);
  }
}
