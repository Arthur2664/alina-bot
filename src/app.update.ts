import { createKysely } from '@vercel/postgres-kysely';
import { Generated } from 'kysely';
import {
  Update,
  Ctx,
  Start,
  Help,
  On,
  Hears,
  InjectBot,
  Command,
} from 'nestjs-telegraf';
import { Readable } from 'stream';
import { Context, Input } from 'telegraf';
import axios from 'axios';
import cron from 'node-cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

interface ImageTable {
  data: Uint8Array;
}

interface Database {
  image: ImageTable;
}

@Update()
export class AppUpdate {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(@Ctx() ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hears(@Ctx() ctx: Context) {
    await ctx.reply('Hey there');
  }
  @Command('schedule')
  async schedule(@Ctx() ctx: Context) {
    const job = new CronJob(`23 23 * * *`, async () => {
      const db = createKysely<Database>();
      const data = await db
        .selectFrom('image')
        .select('data')
        .executeTakeFirst();

      const stream = Readable.from(data.data);

      const file = Input.fromReadableStream(stream);
      await ctx.sendPhoto(file);
      await ctx.telegram.sendPhoto('-1001739837583', file);
    }, null, null, 'Europe/Kiev');

    const jobName = 'PostsToFans';

    if(this.schedulerRegistry.doesExist('cron',jobName)){
      this.schedulerRegistry.deleteCronJob(jobName);
    }
    this.schedulerRegistry.addCronJob(jobName, job);

    job.start()
    await ctx.reply('schedule!: ' + job.nextDate);
  }

  @Hears('photo')
  async hearsPhoto(@Ctx() ctx: Context) {
    const db = createKysely<Database>();
    const data = await db.selectFrom('image').select('data').executeTakeFirst();

    const stream = Readable.from(data.data);

    const file = Input.fromReadableStream(stream);
    await ctx.sendPhoto(file);
    db.destroy();
  }

  @On('message')
  async onPhoto(@Ctx() ctx: Context) {
    if (!('message' in ctx.update)) {
      await ctx.reply('No message');
      return;
    }

    if (!('photo' in ctx.update.message)) {
      await ctx.reply('No photo');
      return;
    }

    const fileId = ctx.update.message.photo.pop().file_id;

    const file = await ctx.telegram.getFile(fileId);

    await ctx.reply('FILE PATH' + file.file_path);

    let url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const db = createKysely<Database>();
    var { data } = await db
      .insertInto('image')
      .values({ data: response.data })
      .returning('data')
      .executeTakeFirst();
    await ctx.reply(data.toString());
    db.destroy();
  }
}
