import {
    Update,
    Ctx,
    Start,
    Help,
    On,
    Hears,
  } from 'nestjs-telegraf';
import { Context } from 'telegraf';
const axios = require('axios');
import * as fs from 'node:fs';
import DatabaseFilesService from './services/databaseFiles.service';
import { Injectable } from '@nestjs/common';
  
  @Update()
  @Injectable()
  export class AppUpdate {
    constructor(private readonly databaseFilesService: DatabaseFilesService,) {
        
    }

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
        const file = await this.databaseFilesService.getFile();
        await ctx.sendPhoto(file);
    }

    @On('photo')
    async onPhoto(@Ctx() ctx: any) {
        const fileId = ctx.message.photo.pop().file_id
		  ctx.telegram.getFileLink(fileId).then(url => {    
			  axios({url, responseType: 'arraybuffer'}).then(response => {
				  return new Promise(() => {
                    this.databaseFilesService.uploadDatabaseFile(response.data, fileId);
						  });
					  })
		  })
      }
  }