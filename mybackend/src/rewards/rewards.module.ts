import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService]
})
export class RewardsModule {}
