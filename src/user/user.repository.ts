import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserRole } from './user-role.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { email, password } = authCredentialsDto;

        const user = new User();
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.role = UserRole.CUSTOMER;

        try {
            await user.save();
        } catch(error) {
            if (error.code != '23505') {
                throw new InternalServerErrorException(error);
            }
            throw new ConflictException('Email already exists');
        }

        return user;
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;
        const user = await this.findOne({ email });

        if (!user || !await user.validatePassword(password)) {
            return null;
        }

        return user.email;
    }

    async getUsers(): Promise<User[]> {
        return await this.find();
    }
}