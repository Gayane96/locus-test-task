import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserCreateSerialization } from 'src/serializations/user.create.serialization';
import { SignupDto } from '../auth-dto/signup.dto';
import { AuthService } from '../services/auth.services';
import { UserSigninSerialization } from 'src/serializations/user.signin.serialization';
import { SigninDto } from '../auth-dto/signin.dto';

@ApiTags('modules.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'Signup',
    type: UserCreateSerialization,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  createUser(@Body() signupDto: SignupDto) {
    return this.authService.createUser(signupDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('signin')
  @ApiCreatedResponse({
    description: 'Signin',
    type: UserSigninSerialization,
  })
  async signin(@Body() signinDto: SigninDto) {
    const data: any = await this.authService.signIn(signinDto);
    return {
      accessToken: data.accessToken,
    };
  }
}
