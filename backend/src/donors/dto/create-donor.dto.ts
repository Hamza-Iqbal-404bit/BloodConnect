import {
    IsEmail,
    IsString,
    IsEnum,
    IsOptional,
    MinLength,
} from 'class-validator';
import { BloodGroup, ContactMethod } from '@prisma/client';

export class CreateDonorDto {
    // User fields
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsEnum(BloodGroup)
    bloodGroup: BloodGroup;

    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    batch?: string;

    @IsOptional()
    @IsString()
    whatsappNumber?: string;

    @IsOptional()
    @IsEnum(ContactMethod)
    preferredContact?: ContactMethod;
}
