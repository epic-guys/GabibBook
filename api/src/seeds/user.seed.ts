import logger from '../logger'
import { User, Role, UserType } from '../models/user.model'
import argon2 from 'argon2'

export async function seedUsers(): Promise<void> {

     //if there are already users in the database, delete them
     await User.deleteMany();
     logger.info('🗑️ User collection deleted');

     let modHash = await argon2.hash('mod');
     let studHash = await argon2.hash('stud');


     const users: UserType[] = [
          { name: 'Mod', surname: 'Mod', nickname: 'mod', email: 'mod@gmail.com', password_hash: modHash, role: Role.Moderator },
          { name: 'Stud', surname: 'Stud', nickname: 'stud', email: 'stud@gmail.com', password_hash: studHash, role: Role.Student }
     ];
     await User.insertMany(users);
     logger.info('🌱 User collection seeded');
}
