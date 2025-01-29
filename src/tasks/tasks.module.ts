import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/groups/entities/groups.model';
import { Task } from './entities/task.model';
import { UserGroup } from 'src/db/usersgroups.model';
import { GroupService } from 'src/groups/groups.service';
import { User } from 'src/users/entities/users.model';

@Module({
  imports: [SequelizeModule.forFeature([UserGroup, Task, Group, User])],
  providers: [TaskService, GroupService],
  controllers: [TaskController],
})
export class TaskModule {}
