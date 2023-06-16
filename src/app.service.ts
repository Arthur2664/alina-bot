import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { createKysely } from '@vercel/postgres-kysely';
import { Readable } from 'stream';
import { Input, Telegram } from 'telegraf';

interface ImageTable {
  data: Uint8Array;
}

interface Database {
  image: ImageTable;
}

@Injectable()
export class AppService {

  private readonly bot: Telegram = new Telegram(process.env.BOT_TOKEN);

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(`47 23 * * *`, {timeZone: 'Europe/Kiev'})
  async runCronEvery30Seconds() {
    const db = createKysely<Database>();
    const data = await db
      .selectFrom('image')
      .select('data')
      .executeTakeFirst();

    const stream = Readable.from(data.data);

    const file = Input.fromReadableStream(stream);
    await this.bot.sendPhoto('-1001739837583', file);
  }
}
