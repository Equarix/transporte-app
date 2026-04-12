import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GaleryService } from './galery.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Auth([RoleEnum.ADMIN])
@Controller('images')
export class GaleryController {
  constructor(private readonly galeryService: GaleryService) { }

  @Post()
  @UseInterceptors(FileInterceptor('data'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.galeryService.create(file);
  }

  @Get()
  findAll() {
    return this.galeryService.findAll();
  }
}
