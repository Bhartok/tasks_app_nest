import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './entities/groups.model';
import { GroupController } from './groups.controller';
import { GroupService } from './groups.service';
import { UserGroup } from 'src/db/usersgroups.model';
import { User } from 'src/users/entities/users.model';

@Module({
  imports: [SequelizeModule.forFeature([Group, UserGroup, User])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
