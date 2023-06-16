import { Module } from '@nestjs/common';
import DatabaseFilesService from '../services/databaseFiles.service';
import { AppUpdate } from '../app.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseFile from '../entities/databaseFile.entity';
import { env } from 'process';

@Module({
    imports:[    TypeOrmModule.forRoot({
        type: 'postgres',
        host: env.POSTGRES_HOST,
        port: 3306,
        username: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DATABASE,
        autoLoadEntities : true
      }),
      TypeOrmModule.forFeature([DatabaseFile]),],
    providers: [DatabaseFilesService, AppUpdate],
    exports:[DatabaseFilesService]
})
export class AlinaBotModule {}
