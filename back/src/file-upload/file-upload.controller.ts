import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('uploadImage/:productId')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'Tamaño del archivo demasiado grande',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|gif)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.fileUploadService.uploadImage(file, productId);
  }
}
