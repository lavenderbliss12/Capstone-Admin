import { Module } from '@nestjs/common';
import { UserManagementService } from './user_management.service';
import { UserManagementController } from './user_management.controller';
import { DatabaseModule } from 'src/database/database.module'; //to access database

@Module({
   imports: [DatabaseModule], //to access database
  controllers: [UserManagementController],
  providers: [UserManagementService],
})
export class UserManagementModule {}
