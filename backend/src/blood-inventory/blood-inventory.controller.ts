import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { BloodInventoryService } from './blood-inventory.service';
import { UpdateInventoryDto } from './dto';
import { BloodGroup } from '@prisma/client';

@Controller('blood-inventory')
export class BloodInventoryController {
    constructor(private bloodInventoryService: BloodInventoryService) { }

    @Get()
    async findAll() {
        return this.bloodInventoryService.findAll();
    }

    @Patch(':bloodGroup')
    async update(
        @Param('bloodGroup') bloodGroup: BloodGroup,
        @Body() updateDto: UpdateInventoryDto,
    ) {
        return this.bloodInventoryService.update(bloodGroup, updateDto);
    }
}
