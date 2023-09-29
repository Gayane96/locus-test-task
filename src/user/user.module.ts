import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './services/user.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entity/auth.entity';
import { AuthService } from 'src/auth/services/auth.services';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [JwtService, UserService, AuthService],
})
export class UserModule {}
