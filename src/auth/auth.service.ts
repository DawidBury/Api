import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.userRepository.singUp(authCredentialsDto);
    }

    async signIn (authCredentialsDto: AuthCredentialsDto): Promise<Array<any>> {
        const email = await this.userRepository.validatePassword(authCredentialsDto);

        if (!email) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const user = await this.userRepository.findOne({ where: { "email": email} });

        if (user.banned === true) {
            throw new ForbiddenException();
        }

        const payload: JwtPayload = { email };
        const accessToken = await this.jwtService.sign(payload);

        return [user, { accessToken }];
    }
}
