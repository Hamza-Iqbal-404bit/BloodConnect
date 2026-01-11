import { IsEnum } from 'class-validator';
import { ApprovalStatus, RequestStatus } from '@prisma/client';

export class UpdateApprovalDto {
    @IsEnum(ApprovalStatus)
    approvalStatus: ApprovalStatus;
}

export class UpdateStatusDto {
    @IsEnum(RequestStatus)
    status: RequestStatus;
}
