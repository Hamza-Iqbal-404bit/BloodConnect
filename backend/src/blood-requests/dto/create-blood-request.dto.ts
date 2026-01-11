import {
    IsString,
    IsEnum,
    IsOptional,
    IsInt,
    Min,
    IsPhoneNumber,
} from 'class-validator';
import { BloodGroup, UrgencyLevel } from '@prisma/client';

export class CreateBloodRequestDto {
    @IsString()
    patientName: string;

    @IsEnum(BloodGroup)
    bloodGroup: BloodGroup;

    @IsInt()
    @Min(1)
    unitsNeeded: number;

    @IsOptional()
    @IsEnum(UrgencyLevel)
    urgencyLevel?: UrgencyLevel;

    @IsString()
    location: string;

    @IsString()
    hospitalName: string;

    @IsString()
    contactPerson: string;

    @IsString()
    contactPhone: string;

    @IsOptional()
    @IsString()
    contactWhatsapp?: string;

    @IsOptional()
    @IsString()
    remarks?: string;
}
