import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppUpdate } from './app.update';
import DatabaseFilesService from './services/databaseFiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import DatabaseFile from './entities/databaseFile.entity';
import { sessionMiddleware } from './middleware/sessionMidl';
import { AlinaBotModule } from './alina-bot/alina-bot.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [AlinaBotModule, ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
        launchOptions: {
          dropPendingUpdates: true,
          webhook: {
            domain: configService.get<string>('VERCEL_URL'),
            hookPath: '/secret-path'
          }
        }
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([DatabaseFile]),
    AlinaBotModule,
  ],
  controllers: [AppController],
  providers: [DatabaseFilesService, AppService],
  exports: [DatabaseFilesService, TypeOrmModule]
})
export class AppModule {}
