import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserManagementModule } from './user_management/user_management.module';
import { RewardsModule } from './rewards/rewards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BiowasteModule } from './biowaste/biowaste.module';
import { StatsModule } from './stats/stats.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserManagementModule, RewardsModule, TransactionsModule, BiowasteModule, StatsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
