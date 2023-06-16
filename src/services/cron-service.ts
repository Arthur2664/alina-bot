import { Injectable } from '@nestjs/common';
import { Telegram } from 'telegraf';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly bot: Telegram = new Telegram(process.env.BOT_TOKEN);

  constructor() {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async runCronEvery30Seconds() {
    await this.bot.sendMessage('chat ID','Hello there');
  }

}