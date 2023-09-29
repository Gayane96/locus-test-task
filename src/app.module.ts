import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocusModule } from './locus/locus.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/entity/auth.entity';
import { UserModule } from './user/user.module';
import { RncLocus } from './locus/entity/locus.entity';
import { RncLocusMembers } from './locus/entity/locus-members.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [UserEntity, RncLocus, RncLocusMembers],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    LocusModule,
  ],
  controllers: [],
  providers: [ConfigModule],
})
export class AppModule {}
