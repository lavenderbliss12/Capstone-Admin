import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserManagementModule } from './user_management/user_management.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserManagementModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
