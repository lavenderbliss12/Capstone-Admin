import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateUserManagementDto {
    @IsNotEmpty()
    @IsString()
    surname: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsNumber()
    points?: number;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    uid?: string;

}
