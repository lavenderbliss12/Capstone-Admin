import { Module } from '@nestjs/common';
import { BiowasteController } from './biowaste.controller';
import { BiowasteService } from './biowaste.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BiowasteController],
  providers: [BiowasteService],
})
export class BiowasteModule {}
