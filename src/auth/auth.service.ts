import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as crypto from 'crypto';
import { User } from 'src/users/entities/users.model';
import { SignupDto, SignInDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private salt = this.configService.get<string>('CRYPT_SALT');
  private jwtSecret = this.configService.get<string>('JWT_SECRET');
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(
    password: string,
    iterations: number = 500,
    keyLength: number = 64,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        this.salt,
        iterations,
        keyLength,
        'sha256',
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString('hex'));
        },
      );
    });
  }

  async signUp(dto: SignupDto): Promise<string> {
    const { email, password, name } = dto;
    const hashPw = await this.hashPassword(password);
    try {
      const user = await this.userModel.create({
        email,
        password: hashPw,
        name,
      });
      return user.id;
    } catch {
      throw new BadRequestException('Error creating user');
    }
  }

  async signIn(dto: SignInDto) {
    const { email, password } = dto;

    const user = await this.userModel.findOne({ where: { email } });
    const hashPw = await this.hashPassword(password);

    if (!user || hashPw != user.password) {
      throw new BadRequestException('Could not sign in');
    }

    const payload = { sub: user.id };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.jwtSecret,
    });

    return { acces_token: token };
  }
}
