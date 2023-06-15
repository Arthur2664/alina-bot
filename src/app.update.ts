import {
    Update,
    Ctx,
    Start,
    Help,
    On,
    Hears,
  } from 'nestjs-telegraf';
import { Context } from 'telegraf';\
const axios = require('axios');
import * as fs from 'node:fs';
  
  @Update()
  export class AppUpdate {
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

    @On('photo')
    async onPhoto(@Ctx() ctx: any) {
        const fileId = ctx.message.photo.pop().file_id
		  ctx.telegram.getFileLink(fileId).then(url => {    
			  axios({url, responseType: 'stream'}).then(response => {
				  return new Promise(() => {
					  response.data.pipe(fs.createWriteStream(`photos/${ctx.update.message.from.id}.jpg`))
								  .on('finish', () =>  await ctx.reply('👍'))
								  .on('error', e => await ctx.reply('Fail!'))
						  });
					  })
		  })
      }
  }