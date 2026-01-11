import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';

export class UpdateInventoryDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    unitsAvailable?: number;

    @IsOptional()
    @IsString()
    @IsIn(['available', 'low', 'urgent'])
    status?: string;
}
