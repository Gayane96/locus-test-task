import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from '../auth-dto/signup.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SigninDto } from '../auth-dto/signin.dto';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getTokens(email: string) {
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1d',
        },
      ),
    ]);

    return {
      accessToken,
    };
  }

  async hashData(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async decodeToken(token: string) {
    type PayloadType = {
      email: string;
    };

    return this.jwtService.decode(token) as PayloadType;
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });

    return await this.userRepository.findOne({
      where: {
        email: payload.sub,
      },
    });
  }

  async createUser(userDetalis: SignupDto) {
    // find the user by email
    const user = await this.userRepository.findOne({
      where: { email: userDetalis.email },
    });

    // if user exist throw exception
    if (user) return 'Email is already registered';

    // generate the password hash
    const hash = await this.hashData(userDetalis.password);

    const token = await this.getTokens(userDetalis.email);

    // save the new user in the db
    const newUser = await this.userRepository.create({
      ...userDetalis,
      password: hash,
    });
    await this.userRepository.save(newUser);

    return token;
  }

  async signIn(data: SigninDto) {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    // if user does not exist throw exception
    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(data.email);

    return tokens;
  }
}
