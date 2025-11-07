import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserManagementDto } from './dto/create-user_management.dto';
import { UpdateUserManagementDto } from './dto/update-user_management.dto';

@Injectable()
export class UserManagementService {
  constructor (private readonly databaseService: DatabaseService) {}

  async create(createUserManagementDto: CreateUserManagementDto) {

    try {
      return await this.databaseService.user.create({
        data: createUserManagementDto,
      });
    } catch (err) {
      throw new HttpException(
        `Failed to create user: ${err?.message ?? err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all userManagement`;
  }

  async findOne(id: number) {
    try {
      return await this.databaseService.user.findUnique({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw new HttpException(
        `Failed to find user ${id}: ${err?.message ?? err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserManagementDto: UpdateUserManagementDto) {
    try {
      // Do not pass the id field as part of the update data (Prisma model uses id)
      const { id: _id, ...data } = updateUserManagementDto as any;
      return await this.databaseService.user.update({
        where: {
          id: id,
        },
        data,
      });
    } catch (err) {
      throw new HttpException(
        `Failed to update user ${id}: ${err?.message ?? err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.databaseService.user.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw new HttpException(
        `Failed to remove user ${id}: ${err?.message ?? err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
