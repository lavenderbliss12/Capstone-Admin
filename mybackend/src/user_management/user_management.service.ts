import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserManagementDto } from './dto/create-user_management.dto';
import { UpdateUserManagementDto } from './dto/update-user_management.dto';

@Injectable()
export class UserManagementService {
  constructor (private readonly databaseService: DatabaseService) {}

  async create(createUserManagementDto: CreateUserManagementDto) {

    try {
      // Provide defaults for required mapped fields (uid, username)
      const data: any = {
        ...createUserManagementDto,
        uid: createUserManagementDto.uid || `UID-${Date.now()}`,
        username: createUserManagementDto.username || createUserManagementDto.email.split('@')[0],
        points: createUserManagementDto.points ?? 0,
      };
      return await this.databaseService.user.create({ data });
    } catch (err) {
      throw new HttpException(
        `Failed to create user: ${err?.message ?? err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.databaseService.user.findMany({
        orderBy: { id: 'desc' },
      });
    } catch (err) {
      throw new HttpException(
        `Failed to list users: ${err?.message ?? err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
