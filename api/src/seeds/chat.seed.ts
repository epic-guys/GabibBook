import logger from '../logger'
import {Chat} from '../models/chat.model';
import { User } from '../models/user.model'
import fs from 'fs';

export async function seedChats(): Promise<void> {

  await Chat.deleteMany();
  logger.info('🗑️ Chat collection deleted'); 

  let chats = JSON.parse(fs.readFileSync('seed-data/chats/chats.json', 'utf8'));
  for (let i = 0; i < chats.length; i++) {

      if (chats[i].buyer) {
          let buyer = await User.findOne({nickname: chats[i].buyer});
          if (!buyer) {
              throw new Error(`🚫 Could not find user with nickname ${chats[i].buyer}`);
          }
          chats[i].buyer = buyer._id;
      }

      for (let j = 0; j < chats[i].messages.length; j++) {
          let sender = await User.findOne({nickname: chats[i].messages[j].sender});
            

          if (!sender) {
              throw new Error(`🚫 Could not find user with nickname ${chats[i].messages[j].sender}`);
          }

          chats[i].messages[j].sender = sender._id;
      }
  }

  await Chat.insertMany(chats);
  logger.info('👥 Chat collection seeded');
}
