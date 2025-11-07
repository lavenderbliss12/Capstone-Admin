import { PartialType } from '@nestjs/mapped-types';
import { CreateUserManagementDto } from './create-user_management.dto';
import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class UpdateUserManagementDto extends PartialType(CreateUserManagementDto) {
    @IsNotEmpty()
    @IsNumber()
    id: number; // Add this field for unique identification
}