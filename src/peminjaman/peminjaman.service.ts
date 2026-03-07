import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';

@Injectable()
export class PeminjamanService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.peminjaman.findMany({
      include: {
        student: true,
        book: true,
      },
    });
  }

  async findById(id: number) {
    const data = await this.prisma.peminjaman.findUnique({
      where: { id },
      include: {
        student: true,
        book: true,
      },
    });

    if (!data) {
      throw new Error('Peminjaman tidak ditemukan');
    }

    return data;
  }

  async findByDate(date: string) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.prisma.peminjaman.findMany({
      where: {
        borrowDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        student: true,
        book: true,
      },
    });
  }

  async create(dto: CreatePeminjamanDto) {
    const due = dto.dueDate
      ? new Date(dto.dueDate)
      : (() => {
          const d = new Date();
          d.setDate(d.getDate() + 7); // default 7 hari
          return d;
        })();

    // 1️⃣ cek buku sedang dipinjam atau tidak
    const isBorrowed = await this.prisma.peminjaman.findFirst({
      where: {
        bookId: dto.bookId,
        status: 'DIPINJAM',
      },
    });

    if (isBorrowed) {
      // 2️⃣ ambil buku yang belum dipinjam
      const availableBooks = await this.prisma.book.findMany({
        where: {
          peminjamans: {
            none: {
              status: 'DIPINJAM',
            },
          },
        },
        select: {
          id: true,
          title: true,
          author: true,
        },
      });

      // 3️⃣ kembalikan pesan
      return {
        message:
          'Buku sedang dipinjam, anda bisa pinjam buku yang lain',
        availableBooks,
      };
    }

    // 4️⃣ jika buku tersedia, buat peminjaman
    return this.prisma.peminjaman.create({
      data: {
        studentId: dto.studentId,
        bookId: dto.bookId,
        dueDate: due,
        status: 'DIPINJAM',
      },
      include: {
        student: true,
        book: true,
      },
    });
  }
}