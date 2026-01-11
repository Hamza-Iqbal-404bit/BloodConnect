import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateBloodRequestDto,
    UpdateApprovalDto,
    UpdateStatusDto,
} from './dto';
import {
    ApprovalStatus,
    RequestStatus,
    UrgencyLevel,
} from '@prisma/client';

@Injectable()
export class BloodRequestsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const requests = await this.prisma.request.findMany({
            include: {
                city: true,
                user: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return requests.map((request) => this.transformRequest(request));
    }

    async findById(requestId: string) {
        const request = await this.prisma.request.findUnique({
            where: { requestId },
            include: {
                city: true,
                user: true,
            },
        });

        if (!request) {
            throw new NotFoundException('Request not found');
        }

        return request;
    }

    async findActive() {
        const requests = await this.prisma.request.findMany({
            where: {
                approvalStatus: ApprovalStatus.APPROVED,
                status: RequestStatus.PENDING,
            },
            include: {
                city: true,
                user: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        return requests.map((request) => this.transformRequest(request));
    }

    async create(createDto: CreateBloodRequestDto, userId: string) {
        // Find or create city based on location
        let city = await this.prisma.city.findFirst({
            where: {
                name: {
                    equals: createDto.location,
                    mode: 'insensitive',
                },
            },
        });

        if (!city) {
            city = await this.prisma.city.create({
                data: { name: createDto.location },
            });
        }

        const request = await this.prisma.request.create({
            data: {
                patientName: createDto.patientName,
                bloodGroup: createDto.bloodGroup,
                quantity: createDto.unitsNeeded,
                address: createDto.location,
                hospitalName: createDto.hospitalName,
                contactPerson: createDto.contactPerson,
                contactNo: createDto.contactPhone,
                contactWhatsapp: createDto.contactWhatsapp,
                urgencyLevel: createDto.urgencyLevel || UrgencyLevel.LOW,
                remarks: createDto.remarks,
                userId,
                cityId: city.cityId,
                status: RequestStatus.PENDING,
                approvalStatus: ApprovalStatus.PENDING,
            },
            include: {
                city: true,
                user: true,
            },
        });

        return this.transformRequest(request);
    }

    async updateApproval(requestId: string, updateDto: UpdateApprovalDto) {
        const request = await this.prisma.request.update({
            where: { requestId },
            data: {
                approvalStatus: updateDto.approvalStatus,
            },
            include: {
                city: true,
                user: true,
            },
        });

        return this.transformRequest(request);
    }

    async updateStatus(requestId: string, updateDto: UpdateStatusDto) {
        const request = await this.prisma.request.update({
            where: { requestId },
            data: {
                status: updateDto.status,
            },
            include: {
                city: true,
                user: true,
            },
        });

        return this.transformRequest(request);
    }

    // Transform to match frontend expected format
    private transformRequest(request: any) {
        return {
            id: request.requestId,
            patientName: request.patientName,
            bloodGroup: request.bloodGroup,
            unitsNeeded: request.quantity,
            urgencyLevel: request.urgencyLevel,
            location: request.city?.name || request.address,
            hospitalName: request.hospitalName,
            contactPerson: request.contactPerson,
            contactPhone: request.contactNo,
            contactWhatsapp: request.contactWhatsapp,
            status: request.status,
            approvalStatus: request.approvalStatus,
            remarks: request.remarks,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
        };
    }
}
