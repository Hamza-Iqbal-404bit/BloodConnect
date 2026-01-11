import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonorDto, UpdateApprovalDto } from './dto';
import {
    BloodGroup,
    ApprovalStatus,
    UserRole,
    ContactMethod,
} from '@prisma/client';

const SALT_ROUNDS = 10;

@Injectable()
export class DonorsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const donors = await this.prisma.donor.findMany({
            include: {
                user: {
                    include: { city: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return donors.map((donor) => this.transformDonor(donor));
    }

    async findById(donorId: string) {
        const donor = await this.prisma.donor.findUnique({
            where: { donorId },
            include: {
                user: {
                    include: { city: true },
                },
            },
        });

        if (!donor) {
            throw new NotFoundException('Donor not found');
        }

        return this.transformDonor(donor);
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { donor: true },
        });

        return user?.donor;
    }

    async findMatching(bloodGroup: BloodGroup, city?: string) {
        const donors = await this.prisma.donor.findMany({
            where: {
                approvalStatus: ApprovalStatus.APPROVED,
                user: {
                    bloodGroup,
                    ...(city && {
                        city: {
                            name: {
                                contains: city,
                                mode: 'insensitive',
                            },
                        },
                    }),
                },
            },
            include: {
                user: {
                    include: { city: true },
                },
            },
        });

        return donors.map((donor) => this.transformDonor(donor));
    }

    async create(createDonorDto: CreateDonorDto) {
        // Check if email already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createDonorDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Parse name into first and last name
        const nameParts = createDonorDto.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Find or create city
        let city = await this.prisma.city.findFirst({
            where: {
                name: {
                    equals: createDonorDto.city,
                    mode: 'insensitive',
                },
            },
        });

        if (!city) {
            city = await this.prisma.city.create({
                data: { name: createDonorDto.city },
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            createDonorDto.password,
            SALT_ROUNDS,
        );

        // Create user and donor in a transaction
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: createDonorDto.email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phoneNo: createDonorDto.phone,
                    bloodGroup: createDonorDto.bloodGroup,
                    preferredContact:
                        createDonorDto.preferredContact || ContactMethod.WHATSAPP,
                    cityId: city.cityId,
                    role: UserRole.DONOR,
                },
            });

            const donor = await tx.donor.create({
                data: {
                    userId: user.userId,
                    whatsappNumber: createDonorDto.whatsappNumber,
                    approvalStatus: ApprovalStatus.PENDING,
                },
                include: {
                    user: {
                        include: { city: true },
                    },
                },
            });

            return donor;
        });

        return this.transformDonor(result);
    }

    async updateApproval(donorId: string, updateApprovalDto: UpdateApprovalDto) {
        const donor = await this.prisma.donor.update({
            where: { donorId },
            data: {
                approvalStatus: updateApprovalDto.approvalStatus,
            },
            include: {
                user: {
                    include: { city: true },
                },
            },
        });

        return this.transformDonor(donor);
    }

    // Transform donor to match frontend expected format
    private transformDonor(donor: any) {
        return {
            id: donor.donorId,
            name: `${donor.user.firstName} ${donor.user.lastName}`.trim(),
            email: donor.user.email,
            phone: donor.user.phoneNo,
            bloodGroup: donor.user.bloodGroup,
            city: donor.user.city?.name || '',
            batch: null, // Legacy field
            lastDonationDate: donor.lastDonated,
            approvalStatus: donor.approvalStatus,
            whatsappNumber: donor.whatsappNumber,
            isAvailableForDonation: donor.isAvailableForDonation,
            totalDonations: donor.totalDonations,
            createdAt: donor.createdAt,
            updatedAt: donor.updatedAt,
        };
    }
}
