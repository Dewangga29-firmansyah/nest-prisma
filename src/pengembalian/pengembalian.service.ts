import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePengembalianDto } from './dto/create-pengembalian.dto';

@Injectable()
export class PengembalianService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePengembalianDto) {
    return this.prisma.$transaction(async (tx) => {
      const peminjaman = await tx.peminjaman.findUnique({
        where: { id: dto.peminjamanId },
      });

      if (!peminjaman) {
        throw new Error('Peminjaman tidak ditemukan');
      }

      if (peminjaman.status === 'DIKEMBALIKAN') {
        throw new Error('Buku sudah dikembalikan');
      }

      const returnDate = dto.returnDate ? new Date(dto.returnDate) : new Date();

      const diffMs = returnDate.getTime() - peminjaman.dueDate.getTime();
      const lateDays = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;

      const DENDA_PER_HARI = 15000;
      const denda = lateDays * DENDA_PER_HARI;

      const pengembalian = await tx.pengembalian.create({
        data: {
          peminjamanId: dto.peminjamanId,
          denda,
        },
      });

      await tx.peminjaman.update({
        where: { id: dto.peminjamanId },
        data: {
          status: 'DIKEMBALIKAN',
          returnDate,
        },
      });

      return {
        ...pengembalian,
        returnDate,
        lateDays,
        denda,
        message: lateDays > 0 ? `Buku terlambat ${lateDays} hari, denda Rp${denda}` : 'Buku dikembalikan tepat waktu',
      };
    });
  }

  async findAll() {
    return this.prisma.pengembalian.findMany({
      include: {
        peminjaman: {
          include: {
            student: true,
            book: true,
          },
        },
      },
    });
  }
}