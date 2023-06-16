import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { createKysely } from '@vercel/postgres-kysely';
import { Readable } from 'stream';
import { Input, Telegram } from 'telegraf';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
}
