import {
    Controller,
    Body,
    ValidationPipe,
    Post,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../user/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    @UseInterceptors(ClassSerializerInterceptor)
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    @HttpCode(200)
    @UseInterceptors(ClassSerializerInterceptor)
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<Array<any>> {
        return this.authService.signIn(authCredentialsDto);
    }
}
