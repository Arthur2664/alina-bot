import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import DatabaseFile from 'src/entities/databaseFile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Readable } from 'stream';
import { Input } from 'telegraf';
import { InputFile } from 'telegraf/typings/core/types/typegram';
 
@Injectable()
class DatabaseFilesService {
  constructor(
    @InjectRepository(DatabaseFile)
    private databaseFilesRepository: Repository<DatabaseFile>,
  ) {}
 
  async uploadDatabaseFile(dataBuffer: Buffer, filename: string) {
    const newFile = await this.databaseFilesRepository.create({
      filename,
      data: dataBuffer
    })
    await this.databaseFilesRepository.save(newFile);
    return newFile;
  }
 
  async getFile() : Promise<InputFile> {
    const file = await this.databaseFilesRepository.find()[0];
    if (!file) {
      throw new NotFoundException();
    }
    const stream = Readable.from(file.data);

    
    return Input.fromReadableStream(stream);
  }
}
 
export default DatabaseFilesService;