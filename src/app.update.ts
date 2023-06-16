import { createKysely } from '@vercel/postgres-kysely';
import { Generated } from 'kysely';
import {
    Update,
    Ctx,
    Start,
    Help,
    On,
    Hears,
  } from 'nestjs-telegraf';
import { Readable } from 'stream';
import { Context, Input } from 'telegraf';
const axios = require('axios');
  
interface ImageTable {
  id: Generated<number>
  data: Uint8Array 
}

interface Database {
  image: ImageTable
}


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

    @Hears('photo')
    async hearsPhoto(@Ctx() ctx: Context) {
      const db = createKysely<Database>();
      const data = await db.selectFrom('image')
                    .select('data')
                    .executeTakeFirst();

      const stream = Readable.from(data.data);

        const file = Input.fromReadableStream(stream);
        await ctx.sendPhoto(file);
        db.destroy();
    }

    @On('photo')
    async onPhoto(@Ctx() ctx: any) {
        const fileId = ctx.message.photo.pop().file_id
		  ctx.telegram.getFileLink(fileId).then(url => {    
			  axios({url, responseType: 'arraybuffer'}).then(response => {
				  return new Promise(() => {
                    const db = createKysely<Database>();
                    db.insertInto('image')
                      .values({data: response.data})
                      .execute();
                    db.destroy();
						  });
					  })
		  })
      }
  }