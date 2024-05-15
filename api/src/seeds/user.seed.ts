import logger from '../logger'
import { User, Role, UserType } from '../models/user.model'

export async function seedUsers(): Promise<void> {

     //if there are already users in the database, delete them
     await User.deleteMany();
     logger.info('🗑️ User collection deleted');

     const users: UserType[] = [
          { name: 'Mod', surname: 'Mod', nickname: 'mod', email: 'mod@gmail.com', password: 'mod', role: Role.Moderator },
          { name: 'Stud', surname: 'Stud', nickname: 'stud', email: 'stud@gmail.com', password: 'stud', role: Role.Student }
     ];
     await User.insertMany(users);
     logger.info('🌱 User collection seeded');
}