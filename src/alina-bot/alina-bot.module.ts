import { Module } from '@nestjs/common';
import DatabaseFilesService from '../services/databaseFiles.service';
import { AppUpdate } from '../app.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseFile from '../entities/databaseFile.entity';

@Module({
    imports:[TypeOrmModule.forFeature([DatabaseFile]),],
    providers: [DatabaseFilesService, AppUpdate],
})
export class AlinaBotModule {}
