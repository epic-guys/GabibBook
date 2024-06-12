import mongoose from 'mongoose';
import logger from '../logger'
import { User, Role, UserType } from '../models/user.model'
import argon2 from 'argon2'

export async function seedUsers(): Promise<void> {

     await User.deleteMany();
     logger.info('🗑️ User collection deleted');

     let modHash = await argon2.hash('mod');
     let studHash = await argon2.hash('stud');

     const users: UserType[] = [
          {
              _id: new mongoose.Types.ObjectId('000000000000000000000000'),
              name: 'Mod',
              surname: 'Mod',
              nickname: 'mod',
              email: 'mod@gmail.com',
              passwordHash: modHash,
              address: 'Via da Qua 69',
              city: 'Mestre',
              nation: 'Fantabosco',
              paymentMethods: [
                  {
                    name: 'visa',
                    number: '1234567890',
                    expiration: '12/22',
                    fullName: 'John Doe'
                  },
                  {
                    name: 'mastercard',
                    number: '0987654321',
                    expiration: '12/23',
                    fullName: 'John Doe'
                  },
                  {
                    name: 'amex',
                    number: '1357924680',
                    expiration: '12/24',
                    fullName: 'John Doe'
                  },
                  {
                    name: 'discover',
                    number: '2468013579',
                    expiration: '12/25',
                    fullName: 'John Doe'
                  }
              ],
              role: Role.Moderator
          },
          {
              _id: new mongoose.Types.ObjectId('111111111111111111111111'),
              name: 'Stud',
              surname: 'Stud',
              nickname: 'stud',
              email: 'stud@gmail.com',
              passwordHash: studHash,
              address: 'Via da Qua 420',
              city: 'Mestre',
              nation: 'Fantabosco',
              paymentMethods: [
                  {
                    name: 'visa',
                    number: '1234567890',
                    expiration: '12/22',
                    fullName: 'John Doe'
                  },
                  {
                    name: 'mastercard',
                    number: '0987654321',
                    expiration: '12/23',
                    fullName: 'John Doe'
                  },
                  {
                    name: 'amex',
                    number: '1357924680',
                    expiration: '12/24',
                    fullName: 'John Doe'
                  },
                  {
                    name: 'discover',
                    number: '2468013579',
                    expiration: '12/25',
                    fullName: 'John Doe'
                  }
              ],
              role: Role.Student
          }
     ];
     await User.insertMany(users);
     logger.info('👥 User collection seeded');
}
