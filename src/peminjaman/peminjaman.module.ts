import { Module } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { PeminjamanController } from './peminjaman.controller';

@Module({
  providers: [PeminjamanService],
  controllers: [PeminjamanController],
})
export class PeminjamanModule {}
