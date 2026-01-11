import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInventoryDto } from './dto';
import { BloodGroup } from '@prisma/client';

const ALL_BLOOD_GROUPS = [
    BloodGroup.A_POS,
    BloodGroup.A_NEG,
    BloodGroup.B_POS,
    BloodGroup.B_NEG,
    BloodGroup.AB_POS,
    BloodGroup.AB_NEG,
    BloodGroup.O_POS,
    BloodGroup.O_NEG,
];

@Injectable()
export class BloodInventoryService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        await this.initialize();
    }

    async findAll() {
        const inventory = await this.prisma.bloodInventory.findMany();
        return inventory.map((item) => this.transformInventory(item));
    }

    async findByBloodGroup(bloodGroup: BloodGroup) {
        return this.prisma.bloodInventory.findUnique({
            where: { bloodGroup },
        });
    }

    async update(bloodGroup: BloodGroup, updateDto: UpdateInventoryDto) {
        const existing = await this.findByBloodGroup(bloodGroup);

        if (existing) {
            const inventory = await this.prisma.bloodInventory.update({
                where: { bloodGroup },
                data: {
                    ...(updateDto.unitsAvailable !== undefined && {
                        unitsAvailable: updateDto.unitsAvailable,
                    }),
                    ...(updateDto.status && { status: updateDto.status }),
                },
            });
            return this.transformInventory(inventory);
        } else {
            const inventory = await this.prisma.bloodInventory.create({
                data: {
                    bloodGroup,
                    unitsAvailable: updateDto.unitsAvailable || 0,
                    status: updateDto.status || 'urgent',
                },
            });
            return this.transformInventory(inventory);
        }
    }

    async initialize() {
        for (const group of ALL_BLOOD_GROUPS) {
            const exists = await this.findByBloodGroup(group);
            if (!exists) {
                await this.prisma.bloodInventory.create({
                    data: {
                        bloodGroup: group,
                        unitsAvailable: 0,
                        status: 'urgent',
                    },
                });
            }
        }
    }

    // Transform to match frontend expected format
    private transformInventory(item: any) {
        return {
            id: item.id,
            bloodGroup: item.bloodGroup,
            unitsAvailable: item.unitsAvailable,
            status: item.status,
            lastUpdated: item.lastUpdated,
        };
    }
}
