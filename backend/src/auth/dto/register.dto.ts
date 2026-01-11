import {
    IsEmail,
    IsString,
    MinLength,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { BloodGroup, ContactMethod } from '@prisma/client';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    phoneNo?: string;

    @IsEnum(BloodGroup)
    bloodGroup: BloodGroup;

    @IsOptional()
    @IsEnum(ContactMethod)
    preferredContact?: ContactMethod;

    @IsString()
    cityId: string;
}
