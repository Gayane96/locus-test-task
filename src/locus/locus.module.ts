import { Module } from '@nestjs/common';
import { LocusController } from './controller/locus.controller';
import { LocusService } from './service/locus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RncLocus } from './entity/locus.entity';
import { AuthService } from 'src/auth/services/auth.services';
import { UserEntity } from 'src/auth/entity/auth.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([RncLocus, UserEntity])],
  controllers: [LocusController],
  providers: [LocusService, AuthService, JwtService],
})
export class LocusModule {}
