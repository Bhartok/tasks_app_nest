import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/users.model';
import { Group } from 'src/groups/entities/groups.model';
import { UserGroup } from 'src/db/usersgroups.model';
import { Task } from 'src/tasks/entities/task.model';
import { DataType } from 'sequelize-typescript';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Group) private groupModel: typeof Group,
    @InjectModel(UserGroup) private userGroupModel: typeof UserGroup,
    @InjectModel(Task) private taskModel: typeof Task,
  ) {}
  async onModuleInit() {
    UserGroup.belongsTo(User, { foreignKey: 'userId' });
    UserGroup.belongsTo(Group, { foreignKey: 'groupId' });

    User.belongsToMany(Group, {
      through: UserGroup,
      foreignKey: 'userId',
      otherKey: 'groupId',
    });

    Group.belongsToMany(User, {
      through: UserGroup,
      foreignKey: 'groupId',
      otherKey: 'userId',
    });

    Group.hasMany(Task, { foreignKey: 'groupId', keyType:DataType.UUID });
    Task.belongsTo(Group, { foreignKey: 'groupId', keyType:DataType.UUID });
  }
}
