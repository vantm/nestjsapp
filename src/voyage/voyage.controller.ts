import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateVoyageDto } from './dto/create-voyage.dto';
import { UpdateVoyageDto } from './dto/update-voyage.dto';
import { VoyageService } from './voyage.service';

@Controller('voyage')
export class VoyageController {
  constructor(private readonly voyageService: VoyageService) {}

  @Post()
  create(@Body() createVoyageDto: CreateVoyageDto) {
    return this.voyageService.create(createVoyageDto);
  }

  @Get()
  findAll() {
    return this.voyageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voyageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoyageDto: UpdateVoyageDto) {
    return this.voyageService.update(+id, updateVoyageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voyageService.remove(+id);
  }
}
