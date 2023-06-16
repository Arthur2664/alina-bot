import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(getBotToken());

  const botInfo = await bot.telegram.getMe();
		bot.options.username = botInfo.username;
		console.info("Server has initialized bot username using Webhook. ", botInfo.username);
    await bot.telegram.deleteWebhook();
    console.log(`setting webhook to ${process.env.VERCEL_URL}/secret-path`);
    await bot.telegram.setWebhook(`${process.env.VERCEL_URL}/secret-path`);
  app.use(bot.webhookCallback('/secret-path'));
  await app.listen(3333);
}
bootstrap();
