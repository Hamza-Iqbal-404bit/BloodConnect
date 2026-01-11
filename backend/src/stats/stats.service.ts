import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovalStatus, RequestStatus } from '@prisma/client';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getAdminStats() {
        const [
            totalDonors,
            approvedDonors,
            pendingDonors,
            totalRequests,
            activeRequests,
            completedRequests,
            totalDonations,
            todayDonations,
        ] = await Promise.all([
            this.prisma.donor.count(),
            this.prisma.donor.count({
                where: { approvalStatus: ApprovalStatus.APPROVED },
            }),
            this.prisma.donor.count({
                where: { approvalStatus: ApprovalStatus.PENDING },
            }),
            this.prisma.request.count(),
            this.prisma.request.count({
                where: {
                    approvalStatus: ApprovalStatus.APPROVED,
                    status: RequestStatus.PENDING,
                },
            }),
            this.prisma.request.count({
                where: { status: RequestStatus.FULFILLED },
            }),
            this.prisma.donation.count(),
            this.prisma.donation.count({
                where: {
                    donationDate: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
        ]);

        return {
            totalDonors,
            approvedDonors,
            pendingDonors,
            totalRequests,
            activeRequests,
            completedRequests,
            totalDonations,
            todayDonations,
        };
    }

    async getPublicStats() {
        const [totalDonors, totalDonations, activeRequests, completedRequests] =
            await Promise.all([
                this.prisma.donor.count({
                    where: { approvalStatus: ApprovalStatus.APPROVED },
                }),
                this.prisma.donation.count(),
                this.prisma.request.count({
                    where: {
                        approvalStatus: ApprovalStatus.APPROVED,
                        status: RequestStatus.PENDING,
                    },
                }),
                this.prisma.request.count({
                    where: { status: RequestStatus.FULFILLED },
                }),
            ]);

        return {
            totalDonors,
            totalDonations,
            activeRequests,
            completedRequests,
        };
    }
}
