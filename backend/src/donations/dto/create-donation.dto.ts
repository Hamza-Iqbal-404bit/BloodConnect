import { IsString, IsOptional, IsInt, Min, IsDateString } from 'class-validator';

export class CreateDonationDto {
    @IsString()
    donorId: string;

    @IsString()
    requestId: string;

    @IsOptional()
    @IsDateString()
    donationDate?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    unitsContributed?: number;

    @IsOptional()
    @IsString()
    remarks?: string;
}
