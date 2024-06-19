import logger from '../logger'
import { User } from '../models/user.model'
import argon2 from 'argon2'
import fs from 'fs';

export async function seedUsers(): Promise<void> {

  await User.deleteMany();
  logger.info('🗑️ User collection deleted'); 

  let moderators = JSON.parse(fs.readFileSync('seed-data/users/users-mod.json', 'utf8'));
  let students = JSON.parse(fs.readFileSync('seed-data/users/users-stud.json', 'utf8'));

  let users = moderators.concat(students);

  for (let i = 0; i < users.length; i++) {
    users[i].passwordHash = await argon2.hash(users[i].passwordHash);
  }

  await User.insertMany(users);
  logger.info('👥 User collection seeded');
}
