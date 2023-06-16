import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppUpdate } from './app.update';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [AppUpdate, ConfigModule],
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
  ],
  controllers: [AppController],
  providers: [AppUpdate,  AppService],
})
export class AppModule {}
