import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { createKysely } from '@vercel/postgres-kysely';
import { Input, Telegram } from 'telegraf';
import { Readable } from 'stream';

interface ImageTable {
  id: number
  data: Uint8Array;
}

interface Database {
  image: ImageTable;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly bot: Telegram = new Telegram(process.env.BOT_TOKEN);

  @Get('/api/post')
  async getHello(): Promise<string> {
    const db = createKysely<Database>();
    const data = await db.selectFrom('image').selectAll().executeTakeFirst();

    if(!data){
      throw Error('No photo loaded');
    }

    const stream = Readable.from(data.data);

    const file = Input.fromReadableStream(stream);

    try {
      await this.bot.sendPhoto('-1001739837583', file);
    } catch (error) {
      throw Error(error);
    }

    await db.deleteFrom('image').where('id', '=', data.id).executeTakeFirst()

    await db.destroy();
    return 'SENT!!!';
  }
}
