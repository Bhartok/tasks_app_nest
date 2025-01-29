import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseService } from './database.service';
import { UserGroup } from './usersgroups.model';
import { Group } from 'src/groups/entities/groups.model';
import { User } from 'src/users/entities/users.model';
import { Task } from 'src/tasks/entities/task.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isTestEnv = configService.get<string>('NODE_ENV') === 'test';
        return {
          dialect: isTestEnv ? 'sqlite' : 'postgres',
          storage: isTestEnv ? ':memory:' : undefined,
          host: isTestEnv ? undefined : configService.get<string>('DB_HOST'),
          port: isTestEnv ? undefined : configService.get<number>('DB_PORT'),
          username: isTestEnv
            ? undefined
            : configService.get<string>('DB_USER'),
          password: isTestEnv
            ? undefined
            : configService.get<string>('DB_PASSWORD'),
          database: isTestEnv
            ? undefined
            : configService.get<string>('DB_NAME'),
          autoLoadModels: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User, Group, UserGroup, Task]),
  ],
  providers: [ConfigService, DatabaseService],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
