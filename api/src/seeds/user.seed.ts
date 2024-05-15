import logger from '../logger'
import { User, Role, UserType } from '../models/user.model'

export async function seedUser(): Promise<void> {
    const count = await User.countDocuments()

    if (count > 0) return;

    logger.info('🌱 Seeding user collection...');

    const users: Partial<UserType>[] = [
          { name: 'Mod', surname: 'Mod', nickname: 'mod', email: 'mod@gmail.com', password: 'mod', role: Role.Moderator },
    ];

    await User.insertMany(users);
    logger.info('🌳 User collection seeded!');
}