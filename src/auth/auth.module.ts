import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities/users.model';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategyUser } from './jwt-strategy';
import { UserService } from 'src/users/users.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    JwtStrategyUser,
    JwtService,
    UserService,
  ],
})
export class AuthModule {}
