import { IsNotEmpty, IsString, IsEmail, IsNumber, IsBoolean, IsOptional } from 'class-validator';

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


    @IsNotEmpty()
    @IsNumber()
    points: number;  // Added required points field

}
